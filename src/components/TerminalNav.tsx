'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TerminalNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: '~/', active: pathname === '/' },
    { href: '/about', label: 'about', active: pathname === '/about' },
    { href: '/projects', label: 'projects', active: pathname === '/projects' },
    { href: '/blog', label: 'blog', active: pathname?.startsWith('/blog') },
  ];

  return (
    <nav className="border-b border-terminal-border pb-4 mb-8">
      <div className="flex items-center flex-wrap">
        <span className="text-dim mr-3">user@leen-dev:~$</span>
        <span className="text-dim mr-3">cd</span>
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3 py-1 rounded transition-all ${
              item.active
                ? 'bg-terminal-green bg-opacity-10 text-terminal-green border border-terminal-green'
                : 'text-dim hover:text-terminal-green hover:bg-terminal-green hover:bg-opacity-5 mx-1'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
