import { notFound } from 'next/navigation';
import Link from 'next/link';
import TerminalNav from '@/components/TerminalNav';
import TerminalCard from '@/components/TerminalCard';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { blogDb, commentDb } from '@/lib/db';
import { Comment } from '@/lib/db';
import 'highlight.js/styles/github-dark.css';
import BlogComments from '@/components/BlogComments';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogDb.getBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} - Rejebov Arslan`,
    description: post.summary || post.content.substring(0, 160).replace(/[#*`]/g, ''),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogDb.getBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch comments for this post
  const comments = commentDb.getByPostSlug(slug);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="crt-screen min-h-screen w-full bg-terminal-bg">
      <div className="scanline"></div>
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.1)_90%,rgba(0,0,0,0.15)_100%)]"></div>
      </div>

      <div className="screen-curvature min-h-screen overflow-y-auto overflow-x-hidden p-4 md:p-8">
        <div className="font-mono text-sm md:text-base max-w-4xl mx-auto">
          <TerminalNav />

          {/* Blog post header */}
          <div className="mb-6 pb-4 border-b border-terminal-border">
            <div className="text-dim text-sm mb-4">
              ~/blog/<span className="glow-text">{post.slug}</span>.md
            </div>
            <h1 className="glow-text-amber text-2xl md:text-3xl mb-3">
              {post.title}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-dim">
              <span>
                <span className="text-blue">Published:</span> {formatDate(post.created_at)}
              </span>
              {post.updated_at !== post.created_at && (
                <span>
                  <span className="text-blue">Updated:</span> {formatDate(post.updated_at)}
                </span>
              )}
              <span>
                <span className="text-blue">Comments:</span> {comments.length}
              </span>
            </div>
            {post.summary && (
              <p className="mt-3 text-dim italic">{post.summary}</p>
            )}
          </div>

          {/* Blog post content */}
          <article className="markdown-content mb-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {post.content}
            </ReactMarkdown>
          </article>

          {/* End of article marker */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-terminal-border"></div>
            <div className="text-dim text-sm">✦ End of Post ✦</div>
            <div className="flex-1 h-px bg-terminal-border"></div>
          </div>

          {/* Comments Section */}
          <BlogComments postSlug={slug} initialComments={comments} />

          {/* Back button */}
          <div className="border-t border-terminal-border pt-6 mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-amber hover:text-terminal-green transition-all"
            >
              <span>←</span>
              <span>Back to blog</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = blogDb.getAllPublished();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
