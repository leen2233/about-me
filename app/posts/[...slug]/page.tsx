import { getPostBySlug, getAllPosts } from '../../lib/posts';
import MarkdownRenderer from '../../components/MarkdownRenderer';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  // Filter only posts under "posts/" directory and remove the prefix
  return posts
    .filter(post => post.slug.startsWith('posts/'))
    .map((post) => {
      const slugWithoutPrefix = post.slug.replace(/^posts\//, '');
      const slugParts = slugWithoutPrefix.split('/').filter(Boolean); // Remove empty strings
      return {
        slug: slugParts.length > 0 ? slugParts : ['index'],
      };
    });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  // Await params in Next.js 16
  const { slug } = await params;
  const slugParts = slug.filter(Boolean);
  const fullSlug = 'posts/' + slugParts.join('/');
  const post = await getPostBySlug(fullSlug);

  if (!post) {
    notFound();
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
