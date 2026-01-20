import React from 'react';

interface TerminalCardProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
}

export default function TerminalCard({
  title,
  icon,
  children,
  className = '',
}: TerminalCardProps) {
  return (
    <div
      className={`border border-terminal-green-dim rounded overflow-hidden ${className}`}
    >
      {/* Window title bar */}
      <div className="bg-terminal-green-dim bg-opacity-20 px-3 py-2 flex items-center gap-2">
        {icon && <span className="text-sm">{icon}</span>}
        <span className="text-sm text-dim">{title}</span>
        <div className="ml-auto flex gap-1">
          <span className="w-3 h-3 rounded-full border border-terminal-green-dim"></span>
          <span className="w-3 h-3 rounded-full border border-terminal-green-dim"></span>
          <span className="w-3 h-3 rounded-full border border-terminal-green-dim"></span>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">{children}</div>
    </div>
  );
}
