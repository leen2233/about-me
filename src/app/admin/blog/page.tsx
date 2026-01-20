'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  content: string;
  summary?: string;
  created_at: string;
  updated_at: string;
  published: boolean;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    summary: '',
    published: false,
  });

  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();

      if (!data.authenticated) {
        router.push('/login');
        return;
      }

      await fetchPosts();
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setAuthChecking(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/admin/blog');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingPost
      ? `/api/admin/blog/${editingPost.id}`
      : '/api/admin/blog';

    const method = editingPost ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        await fetchPosts();
        resetForm();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save post');
      }
    } catch (error) {
      console.error('Failed to save post:', error);
      alert('Failed to save post');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      slug: post.slug,
      title: post.title,
      content: post.content,
      summary: post.summary || '',
      published: post.published,
    });
    setShowEditor(true);
    setPreviewMode(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchPosts();
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      content: '',
      summary: '',
      published: false,
    });
    setEditingPost(null);
    setShowEditor(false);
    setPreviewMode(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  if (authChecking) {
    return (
      <div className="crt-screen min-h-screen w-full bg-terminal-bg flex items-center justify-center">
        <div className="scanline"></div>
        <div className="text-dim">Checking authentication...</div>
      </div>
    );
  }

  if (showEditor) {
    return (
      <div className="crt-screen min-h-screen w-full bg-terminal-bg">
        <div className="scanline"></div>
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.1)_90%,rgba(0,0,0,0.15)_100%)]"></div>
        </div>

        <div className="screen-curvature min-h-screen overflow-y-auto overflow-x-hidden p-4 md:p-8">
          <div className="font-mono text-sm md:text-base max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-terminal-border">
              <h1 className="glow-text-amber text-xl">
                {editingPost ? 'Edit Post' : 'New Post'}
              </h1>
              <div className="flex gap-3">
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="px-3 py-1 border border-terminal-border rounded hover:bg-terminal-green hover:text-terminal-bg transition-all text-sm"
                >
                  {previewMode ? 'Split View' : 'Full Preview'}
                </button>
                <button
                  onClick={resetForm}
                  className="px-3 py-1 border border-terminal-red text-terminal-red rounded hover:bg-terminal-red hover:text-terminal-bg transition-all text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Editor Form */}
            <form onSubmit={handleSubmit} className="mb-6">
              <div>
                <label className="block text-blue mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      title,
                      slug: generateSlug(title),
                    }));
                  }}
                  className="w-full bg-black bg-opacity-30 border border-terminal-border rounded px-3 py-2 text-terminal-fg focus:outline-none focus:border-terminal-green"
                  required
                />
                <p className="text-dim text-xs mt-1">
                  Slug: /blog/<span className="text-terminal-green">{formData.slug || 'auto-generated'}</span>
                </p>
              </div>

              <div className="mt-4">
                <label className="block text-blue mb-1">Summary</label>
                <input
                  type="text"
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, summary: e.target.value }))
                  }
                  className="w-full bg-black bg-opacity-30 border border-terminal-border rounded px-3 py-2 text-terminal-fg focus:outline-none focus:border-terminal-green"
                  placeholder="Brief description for blog listing"
                />
              </div>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, published: e.target.checked }))
                  }
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="text-dim text-sm">
                  Published (visible to visitors)
                </label>

                <div className="ml-auto">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-terminal-green text-terminal-bg rounded hover:opacity-90 transition-all"
                  >
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </button>
                </div>
              </div>
            </form>

            {/* Split view: Editor + Live Preview */}
            <div className={previewMode ? 'block' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'}>
              {/* Editor */}
              {!previewMode && (
                <div className="border border-terminal-border rounded-lg overflow-hidden">
                  <div className="bg-terminal-green bg-opacity-10 px-3 py-2 flex items-center gap-2 border-b border-terminal-border">
                    <span className="text-sm text-dim">📝 Editor</span>
                    <span className="text-dim text-xs ml-auto">Markdown</span>
                  </div>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, content: e.target.value }))
                    }
                    className="w-full h-[500px] bg-black bg-opacity-30 p-4 text-terminal-fg focus:outline-none font-mono text-sm resize-none"
                    placeholder="Write your post in Markdown..."
                    required
                  />
                </div>
              )}

              {/* Live Preview */}
              <div className="border border-terminal-border rounded-lg overflow-hidden">
                <div className="bg-terminal-blue bg-opacity-10 px-3 py-2 flex items-center gap-2 border-b border-terminal-border">
                  <span className="text-sm text-dim">👁️ Preview</span>
                  <span className="text-dim text-xs ml-auto">Live</span>
                </div>
                <div className="p-4 h-[500px] overflow-y-auto">
                  <article className="markdown-content">
                    <h1 className="glow-text-amber text-2xl mb-3">{formData.title || 'Untitled'}</h1>
                    {formData.summary && (
                      <p className="text-dim italic mb-4">{formData.summary}</p>
                    )}
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                    >
                      {formData.content || '*Start writing to see preview...*'}
                    </ReactMarkdown>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crt-screen min-h-screen w-full bg-terminal-bg">
      <div className="scanline"></div>
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.1)_90%,rgba(0,0,0,0.15)_100%)]"></div>
      </div>

      <div className="screen-curvature min-h-screen overflow-y-auto overflow-x-hidden p-4 md:p-8">
        <div className="font-mono text-sm md:text-base max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-terminal-border">
            <div>
              <Link href="/" className="text-dim hover:text-terminal-green">
                ~/home
              </Link>
              <span className="mx-2">/</span>
              <span className="glow-text-amber">Admin / Blog</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditor(true)}
                className="px-3 py-1 bg-terminal-green text-terminal-bg rounded hover:opacity-90 transition-all"
              >
                + New Post
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 border border-terminal-border rounded hover:bg-terminal-red hover:text-terminal-bg transition-all text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Posts list */}
          {loading ? (
            <div className="text-dim">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="text-dim">
              <p>No posts yet. Create your first blog post!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="border border-terminal-border rounded p-4 hover:border-terminal-green transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-blue">{post.title}</span>
                        {!post.published && (
                          <span className="text-xs px-2 py-0.5 bg-terminal-amber text-terminal-bg rounded">
                            Draft
                          </span>
                        )}
                      </div>
                      <div className="text-dim text-sm">
                        /{post.slug} • {new Date(post.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-blue hover:underline text-sm"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleEdit(post)}
                        className="text-amber hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick command hint */}
          <div className="mt-12 pt-4 border-t border-terminal-border text-sm">
            <Link href="/" className="text-dim hover:text-terminal-green">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
