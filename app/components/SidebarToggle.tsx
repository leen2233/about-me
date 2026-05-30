'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { Menu } from 'lucide-react';

interface SidebarContextType {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export default function SidebarToggle({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <SidebarContext.Provider value={{ isOpen, open, close, toggle }}>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Hamburger button - only visible on mobile */}
        <button
          onClick={toggle}
          className="
            fixed top-1.5 right-2 z-50
            md:hidden
            p-1 rounded bg-[#3c3836] text-[#ebdbb2]
            border border-[#504945]
            hover:bg-[#504945] transition-colors
          "
          style={{margin: -4}}
          aria-label="Toggle sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}
