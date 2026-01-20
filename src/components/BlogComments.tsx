'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Turnstile from '@/components/Turnstile';

// Dynamically import ReactMarkdown to avoid SSR issues
const ReactMarkdown = dynamic(
  () => import('react-markdown'),
  { ssr: false }
);

// Import plugins directly
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

import { Comment } from '@/lib/db';
import { addComment } from '@/app/actions/comments';

interface BlogCommentsProps {
  postSlug: string;
  initialComments: Comment[];
}

export default function BlogComments({ postSlug, initialComments }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileError, setTurnstileError] = useState(false);
  const turnstileResetRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    try {
      const res = await fetch('/api/admin/is-admin');
      const data = await res.json();
      setIsAdmin(data.isAdmin || false);
    } catch {
      setIsAdmin(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    setDeletingIds((prev) => new Set(prev).add(commentId));

    try {
      const res = await fetch(`/api/admin/comments/${commentId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
      } else {
        alert('Failed to delete comment');
      }
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment');
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setSubmitError('');
    setIsSubmitting(true);

    startTransition(async () => {
      const result = await addComment(postSlug, formData);

      if (result.success) {
        // Refresh comments from server
        const response = await fetch(`/api/comments?slug=${encodeURIComponent(postSlug)}`);
        const data = await response.json();
        setComments(data.comments || []);
        // Reset form and hide it
        const form = document.getElementById('comment-form') as HTMLFormElement;
        form?.reset();
        setTurnstileToken('');
        turnstileResetRef.current?.();
        setShowForm(false);
      } else {
        setSubmitError(result.error || 'Failed to add comment');
      }
      setIsSubmitting(false);
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-16">
      {/* Header with button on the right */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-terminal-border">
        <h2 className="glow-text-amber text-lg">
          💬 Comments ({comments.length})
        </h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 border border-terminal-green text-terminal-green rounded hover:bg-terminal-green hover:bg-opacity-10 transition-all text-sm"
          >
            ✍️ Write Comment
          </button>
        )}
      </div>

      {/* Comment Form - Hidden by default */}
      {showForm && (
        <div className="mb-8 border border-terminal-border rounded-lg p-6 bg-black bg-opacity-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-blue text-lg">Add Your Comment</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-dim hover:text-terminal-red text-sm"
            >
              ✕ Close
            </button>
          </div>

          <form id="comment-form" action={handleSubmit} className="space-y-4">
            {submitError && (
              <div className="p-3 border border-terminal-red bg-terminal-red bg-opacity-10 rounded text-terminal-red text-sm">
                ❌ {submitError}
              </div>
            )}

            <div>
              <label className="block text-dim text-sm mb-1">Your Name *</label>
              <input
                type="text"
                name="author_name"
                required
                minLength={2}
                maxLength={100}
                className="w-full bg-black bg-opacity-50 border border-terminal-border rounded px-4 py-3 text-terminal-fg focus:outline-none focus:border-terminal-green focus:ring-2 focus:ring-terminal-green focus:ring-opacity-20"
                placeholder="Enter your name"
                autoComplete="off"
              />
            </div>

            <div>
              <label className="block text-dim text-sm mb-1">Your Comment *</label>
              <textarea
                name="content"
                required
                minLength={3}
                maxLength={5000}
                rows={5}
                className="w-full bg-black bg-opacity-50 border border-terminal-border rounded px-4 py-3 text-terminal-fg focus:outline-none focus:border-terminal-green focus:ring-2 focus:ring-terminal-green focus:ring-opacity-20 font-mono text-sm resize-y"
                placeholder="Write your thoughts... (Markdown supported: **bold**, `code`, etc.)"
              />
              <div className="flex justify-between mt-1">
                <p className="text-dim text-xs">Markdown supported</p>
                <p className="text-dim text-xs">Max 5000 characters</p>
              </div>
            </div>

            {/* Hidden input for Turnstile token */}
            <input
              type="hidden"
              name="cf-turnstile-response"
              value={turnstileToken}
            />

            {/* Turnstile CAPTCHA widget */}
            <div>
              <label className="block text-dim text-sm mb-2">CAPTCHA Verification *</label>
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
                onVerify={(token) => {
                  setTurnstileToken(token);
                  setTurnstileError(false);
                }}
                onError={() => {
                  setTurnstileError(true);
                  setSubmitError('CAPTCHA failed to load. Please refresh the page.');
                }}
              />
              {turnstileError && (
                <p className="text-terminal-red text-xs mt-1">CAPTCHA verification required</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-dim text-xs flex items-center gap-1">
                🔒 Your data is safe. CAPTCHA verification required.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 border border-terminal-border rounded hover:bg-terminal-border transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isPending || !turnstileToken}
                  className="px-6 py-2 bg-terminal-green text-terminal-bg rounded hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isSubmitting || isPending ? '⏳ Posting...' : '📝 Post Comment'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Comments List Header */}
      {comments.length > 0 && (
        <div className="mb-4">
          <h3 className="text-dim text-sm uppercase tracking-wide">
            {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
          </h3>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-terminal-border rounded-lg">
            <div className="text-4xl mb-3">💭</div>
            <p className="text-dim mb-1">No comments yet</p>
            <p className="text-dim text-sm">Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div
              key={comment.id}
              className="border border-terminal-border rounded-lg p-4 hover:border-terminal-green transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-terminal-green bg-opacity-20 flex items-center justify-center text-terminal-green font-bold text-sm">
                    {comment.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-blue font-medium">{comment.author_name}</div>
                    <div className="text-dim text-xs">{formatDate(comment.created_at)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-dim text-xs">#{index + 1}</span>
                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      disabled={deletingIds.has(comment.id)}
                      className="text-red hover:text-terminal-red text-xs px-2 py-1 border border-terminal-red rounded hover:bg-terminal-red hover:bg-opacity-10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingIds.has(comment.id) ? 'Deleting...' : '🗑️ Delete'}
                    </button>
                  )}
                </div>
              </div>
              <div className="text-terminal-fg leading-relaxed pl-11 markdown-content-comment">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {comment.content}
                </ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
