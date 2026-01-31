import { getPostBySlug } from '../lib/posts';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default async function AboutPage() {
  const post = await getPostBySlug('about');

  if (!post) {
    return (
      <div>
        <h1>About</h1>
        <p>No content found. Create content/about.md to see this page.</p>
      </div>
    );
  }

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-[#8ec07c]">{post.title}</h1>
        <div className="flex gap-4 text-sm text-[#a89984]">
          <time>{post.date}</time>
          {post.tags.length > 0 && (
            <>
              <span>|</span>
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-[#8ec07c]">#{tag}</span>
                ))}
              </div>
            </>
          )}
        </div>
        {post.description && (
          <p className="mt-4 text-[#bdae93]">{post.description}</p>
        )}
      </header>
      <MarkdownRenderer content={post.content} />
    </article>
  );
}
