'use server';

import { commentDb } from '@/lib/db';
import { NewComment } from '@/lib/db';

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not set');
    return false;
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    });

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Turnstile verification failed:', error);
    return false;
  }
}

export async function getComments(postSlug: string) {
  try {
    const comments = commentDb.getByPostSlug(postSlug);
    return { success: true, comments };
  } catch (error) {
    console.error('Failed to fetch comments:', error);
    return { success: false, comments: [] };
  }
}

export async function addComment(postSlug: string, formData: FormData) {
  const authorName = formData.get('author_name') as string;
  const content = formData.get('content') as string;
  const turnstileToken = formData.get('cf-turnstile-response') as string;

  // Verify Turnstile token
  if (!turnstileToken) {
    return {
      success: false,
      error: 'CAPTCHA verification is required',
    };
  }

  const isValidCaptcha = await verifyTurnstileToken(turnstileToken);
  if (!isValidCaptcha) {
    return {
      success: false,
      error: 'CAPTCHA verification failed. Please try again.',
    };
  }

  // Basic validation
  if (!authorName || !content) {
    return {
      success: false,
      error: 'Name and comment are required',
    };
  }

  if (authorName.trim().length < 2) {
    return {
      success: false,
      error: 'Name must be at least 2 characters',
    };
  }

  if (content.trim().length < 3) {
    return {
      success: false,
      error: 'Comment must be at least 3 characters',
    };
  }

  if (authorName.length > 100) {
    return {
      success: false,
      error: 'Name is too long (max 100 characters)',
    };
  }

  if (content.length > 5000) {
    return {
      success: false,
      error: 'Comment is too long (max 5000 characters)',
    };
  }

  try {
    // Get the post ID from slug
    const { blogDb } = await import('@/lib/db');
    const post = blogDb.getBySlug(postSlug);

    if (!post) {
      return {
        success: false,
        error: 'Post not found',
      };
    }

    const newComment: NewComment = {
      post_id: post.id,
      author_name: authorName.trim(),
      content: content.trim(),
    };

    const comment = commentDb.create(newComment);
    return { success: true, comment };
  } catch (error) {
    console.error('Failed to add comment:', error);
    return {
      success: false,
      error: 'Failed to add comment',
    };
  }
}
