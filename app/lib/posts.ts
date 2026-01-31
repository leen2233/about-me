import fs from 'fs';
import path from 'path';

const contentDirectory = path.join(process.cwd(), 'content');

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  draft: boolean;
  content: string;
}

function parseFrontmatter(content: string): { frontmatter: any; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content };
  }

  const frontmatterStr = match[1];
  const markdownContent = match[2];

  // Simple YAML parser for basic key-value pairs
  const frontmatter: any = {};
  const lines = frontmatterStr.split('\n');

  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const rawValue = line.slice(colonIndex + 1).trim();

    // Parse array values like tags: [tag1, tag2]
    if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
      frontmatter[key] = rawValue
        .slice(1, -1)
        .split(',')
        .map((v: string) => v.trim().replace(/['"]/g, ''));
    } else {
      // Remove quotes from string values
      frontmatter[key] = rawValue.replace(/^['"]|['"]$/g, '');
    }
  }

  return { frontmatter, content: markdownContent };
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { frontmatter, content } = parseFrontmatter(fileContents);

    return {
      slug,
      title: frontmatter.title || 'Untitled',
      date: frontmatter.date || '',
      description: frontmatter.description || '',
      tags: frontmatter.tags || [],
      draft: frontmatter.draft || false,
      content,
    };
  } catch {
    return null;
  }
}

export async function getAllPosts(): Promise<Post[]> {
  const slugs: string[] = [];

  function walkDir(dir: string, baseSlug = '') {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath, path.join(baseSlug, file));
      } else if (file.endsWith('.md')) {
        // Use forward slashes for URL paths
        const slug = path.join(baseSlug, file.replace(/\.md$/, '')).split(path.sep).join('/');
        slugs.push(slug);
      }
    }
  }

  walkDir(contentDirectory);

  // Load all posts
  const postsPromises = slugs.map(slug => getPostBySlug(slug));
  const posts = (await Promise.all(postsPromises)).filter((p): p is Post => p !== null);

  // Sort by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export async function getPostsByYear(year: string): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.slug.startsWith(`posts/${year}`));
}
