'use client';

import { usePathname } from 'next/navigation';

interface Tab {
  id: string;
  name: string;
  icon: string;
  path: string;
}

const tabs: Tab[] = [
  { id: '1', name: 'index.md', icon: '', path: '/' },
  { id: '2', name: 'about.md', icon: '', path: '/about' },
];

export default function TabBar() {
  const pathname = usePathname();

  const getDisplayName = (path: string) => {
    if (path === '/') return 'index.md';
    if (path === '/about') return 'about.md';
    if (path.startsWith('/posts')) {
      const parts = path.split('/').filter(Boolean);
      return parts.join('/') + '.md';
    }
    return pathname.split('/').pop() || 'unknown.md';
  };

  const currentTab = tabs.find(t => t.path === pathname) || {
    id: 'current',
    name: getDisplayName(pathname),
    icon: '',
    path: pathname,
  };

  return (
    <div className="flex items-center bg-[#3c3836] h-8 text-sm border-b border-[#504945]">
      {/* Main tabs */}
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`
            flex items-center gap-2 px-3 h-full border-r border-[#504945]
            transition-colors duration-150
            ${tab.path === pathname
              ? 'bg-[#504945] text-[#ebdbb2]'
              : 'bg-[#3c3836] text-[#ebdbb2] hover:bg-[#504945]'
            }
          `}
          onClick={() => {
            if (tab.path !== pathname) {
              window.location.href = tab.path;
            }
          }}
        >
          <span className="text-xs">{tab.icon}</span>
          <span>{tab.name}</span>
        </button>
      ))}

      {/* Current tab (dynamic) */}
      {!tabs.find(t => t.path === pathname) && (
        <button
          className={`
            flex items-center gap-2 px-3 h-full border-r border-[#504945]
            transition-colors duration-150
            bg-[#504945] text-[#ebdbb2]
          `}
        >
          <span className="text-xs">{currentTab.icon}</span>
          <span>{currentTab.name}</span>
        </button>
      )}
    </div>
  );
}
