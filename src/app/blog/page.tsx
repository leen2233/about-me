'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TerminalNav from '@/components/TerminalNav';
import TerminalCard from '@/components/TerminalCard';

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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/blog')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const stripMarkdown = (text: string) => {
    return text
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .substring(0, 150);
  };

  return (
    <div className="crt-screen min-h-screen w-full bg-terminal-bg">
      <div className="scanline"></div>
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_90%,rgba(0,0,0,0.6)_100%)]"></div>
      </div>

      <div className="screen-curvature min-h-screen overflow-y-auto overflow-x-hidden p-4 md:p-8">
        <div className="font-mono text-sm md:text-base max-w-4xl mx-auto">
          <TerminalNav />

          {/* Header */}
          <div className="mb-8">
            <h1 className="glow-text-amber text-3xl mb-2">~/blog</h1>
            <p className="text-dim">Thoughts, tutorials, and random stuff</p>
          </div>

          {/* Blog Posts */}
          {loading ? (
            <div className="text-dim">Loading posts...</div>
          ) : posts.length === 0 ? (
            <TerminalCard title="empty.md" icon="📭">
              <div className="text-dim">
                <p className="mb-4">No blog posts yet.</p>
                <p className="text-sm">Check back soon for updates!</p>
              </div>
            </TerminalCard>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className="border border-terminal-green-dim rounded p-4 hover:border-terminal-green transition-all group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h2 className="text-blue text-lg mb-2 group-hover:text-terminal-green transition-all">
                          {post.title}
                        </h2>
                        <p className="text-dim text-sm mb-3">
                          {post.summary || stripMarkdown(post.content) + '...'}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-dim">
                          <span>📅 {formatDate(post.created_at)}</span>
                          {post.updated_at !== post.created_at && (
                            <span>✏️ Updated {formatDate(post.updated_at)}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-dim group-hover:text-terminal-green transition-all text-2xl">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* RSS Feed Link (future) */}
          <div className="mt-8 text-center text-dim text-sm">
            <p>Stay tuned for RSS feed support 📡</p>
          </div>
        </div>
      </div>
    </div>
  );
}
