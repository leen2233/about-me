'use client';

import { usePathname } from 'next/navigation';

export default function StatusBar() {
  const pathname = usePathname();

  // Format path relative to "content" directory
  const formatPath = (path: string) => {
    if (path === '/') return 'content/index.md';
    if (path.startsWith('/posts')) {
      return `content${path}.md`;
    }
    if (path.startsWith('/about')) return 'content/about.md';
    return `content${path === '/' ? '/index' : path}.md`;
  };

  const relativePath = formatPath(pathname);
  const isModified = false; // Could be dynamic based on content

  return (
    <div className="flex items-center h-6 text-xs bg-[#504945] border-t border-[#504945]">
      {/* Left section - modification indicator */}
      <div
        className={`
          flex items-center justify-center px-3 h-full
          ${isModified ? 'bg-[#AA4542]' : 'bg-[#84A598]'}
        `}
      >
        {isModified ? '✘' : ' '}
      </div>

      {/* Triangle separator */}
      <div className="flex items-center h-full">
        <div
          className="w-0 h-0"
          style={{
            borderTop: '12px solid transparent',
            borderBottom: '12px solid transparent',
            borderLeft: isModified ? '12px solid #AA4542' : '12px solid #84A598',
          }}
        />
      </div>

      {/* Filename/path section */}
      <div className="flex items-center px-3 text-[#EBDBB2] flex-1">
        {relativePath}
      </div>

      {/* Right section - additional info */}
      <div className="flex items-center gap-4 px-3 text-[#EBDBB2]">
        <span>utf-8</span>
        <span>markdown</span>
      </div>
    </div>
  );
}
