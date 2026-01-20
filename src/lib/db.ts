import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'blog.db');

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    published BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS post_tags (
    post_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    PRIMARY KEY (post_id, tag_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER NOT NULL,
    author_name TEXT NOT NULL,
    author_email TEXT,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
  CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
  CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
  CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
`);

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  summary?: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  tags?: string[];
}

export interface NewBlogPost {
  slug: string;
  title: string;
  content: string;
  summary?: string;
  published?: boolean;
  tags?: string[];
}

// Blog operations
export const blogDb = {
  // Get all published posts
  getAllPublished: (): BlogPost[] => {
    const stmt = db.prepare(`
      SELECT id, slug, title, content, summary, created_at, updated_at, published
      FROM posts
      WHERE published = 1
      ORDER BY created_at DESC
    `);
    return stmt.all() as BlogPost[];
  },

  // Get all posts (including unpublished)
  getAll: (): BlogPost[] => {
    const stmt = db.prepare(`
      SELECT id, slug, title, content, summary, created_at, updated_at, published
      FROM posts
      ORDER BY created_at DESC
    `);
    return stmt.all() as BlogPost[];
  },

  // Get post by slug
  getBySlug: (slug: string): BlogPost | undefined => {
    const stmt = db.prepare(`
      SELECT id, slug, title, content, summary, created_at, updated_at, published
      FROM posts
      WHERE slug = ?
    `);
    return stmt.get(slug) as BlogPost | undefined;
  },

  // Get post by ID
  getById: (id: number): BlogPost | undefined => {
    const stmt = db.prepare(`
      SELECT id, slug, title, content, summary, created_at, updated_at, published
      FROM posts
      WHERE id = ?
    `);
    return stmt.get(id) as BlogPost | undefined;
  },

  // Create new post
  create: (post: NewBlogPost): BlogPost => {
    const stmt = db.prepare(`
      INSERT INTO posts (slug, title, content, summary, published)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      post.slug,
      post.title,
      post.content,
      post.summary ?? null,
      post.published ? 1 : 0
    );

    // Handle tags if provided
    if (post.tags && post.tags.length > 0) {
      const tagStmt = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)');
      const linkStmt = db.prepare('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)');

      for (const tagName of post.tags) {
        const tagResult = tagStmt.run(tagName);
        const tag = db.prepare('SELECT id FROM tags WHERE name = ?').get(tagName) as { id: number };
        linkStmt.run(result.lastInsertRowid, tag.id);
      }
    }

    return blogDb.getById(Number(result.lastInsertRowid))!;
  },

  // Update post
  update: (id: number, post: Partial<NewBlogPost>): boolean => {
    const fields: string[] = [];
    const values: any[] = [];

    if (post.title !== undefined) {
      fields.push('title = ?');
      values.push(post.title);
    }
    if (post.content !== undefined) {
      fields.push('content = ?');
      values.push(post.content);
    }
    if (post.summary !== undefined) {
      fields.push('summary = ?');
      values.push(post.summary);
    }
    if (post.published !== undefined) {
      fields.push('published = ?');
      values.push(post.published);
    }

    if (fields.length === 0) return false;

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`UPDATE posts SET ${fields.join(', ')} WHERE id = ?`);
    const result = stmt.run(...values);

    return result.changes > 0;
  },

  // Delete post
  delete: (id: number): boolean => {
    const stmt = db.prepare('DELETE FROM posts WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },
};

// Comment interfaces
export interface Comment {
  id: number;
  post_id: number;
  author_name: string;
  author_email?: string;
  content: string;
  created_at: string;
}

export interface NewComment {
  post_id: number;
  author_name: string;
  author_email?: string;
  content: string;
}

// Comment operations
export const commentDb = {
  // Get comments for a post
  getByPostId: (postId: number): Comment[] => {
    const stmt = db.prepare(`
      SELECT id, post_id, author_name, author_email, content, created_at
      FROM comments
      WHERE post_id = ?
      ORDER BY created_at ASC
    `);
    return stmt.all(postId) as Comment[];
  },

  // Get comments by post slug
  getByPostSlug: (slug: string): Comment[] => {
    const post = blogDb.getBySlug(slug);
    if (!post) return [];
    return commentDb.getByPostId(post.id);
  },

  // Get comment by ID
  getById: (id: number): Comment | undefined => {
    const stmt = db.prepare(`
      SELECT id, post_id, author_name, author_email, content, created_at
      FROM comments
      WHERE id = ?
    `);
    return stmt.get(id) as Comment | undefined;
  },

  // Create new comment
  create: (comment: NewComment): Comment => {
    const stmt = db.prepare(`
      INSERT INTO comments (post_id, author_name, author_email, content)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(
      comment.post_id,
      comment.author_name,
      comment.author_email ?? null,
      comment.content
    );
    return commentDb.getById(Number(result.lastInsertRowid))!;
  },

  // Delete comment
  delete: (id: number): boolean => {
    const stmt = db.prepare('DELETE FROM comments WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },

  // Get comment count for a post
  countByPostId: (postId: number): number => {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM comments WHERE post_id = ?');
    const result = stmt.get(postId) as { count: number };
    return result.count;
  },
};

export default db;
