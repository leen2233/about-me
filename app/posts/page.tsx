import { getAllPosts } from '../lib/posts';
import Link from 'next/link';

export default async function PostsPage() {
  const posts = await getAllPosts();

  // Group posts by year
  const postsByYear = posts.reduce((acc, post) => {
    const year = post.slug.match(/posts\/(\d{4})/)?.[1] || 'Other';
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-[#8ec07c]">Blog Posts</h1>

      {Object.entries(postsByYear)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([year, yearPosts]) => (
          <div key={year} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-[#83a598] flex items-center gap-2">
              <span className="text-[#3FC5FF]"></span>
              {year}/
            </h2>
            <div className="border-l-2 border-[#504945] pl-4">
              {yearPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/${post.slug}`}
                  className="block py-2 hover:bg-[#504945] -ml-4 pl-4 pr-2 rounded transition-colors duration-150"
                >
                  <div className="flex items-center gap-2 text-sm text-[#a89984] mb-1">
                    <span className="text-xs"></span>
                    <span>{post.slug.split('/').pop()}.md</span>
                    <span className="text-[#8ec07c]">✓</span>
                  </div>
                  <h3 className="text-lg text-[#ebdbb2] hover:text-[#8ec07c]">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[#bdae93] mt-1">{post.description}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}

      {posts.length === 0 && (
        <p className="text-[#a89984]">No posts found. Create your first post in \`content/posts/\`</p>
      )}
    </div>
  );
}
