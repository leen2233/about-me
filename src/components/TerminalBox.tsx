import React from 'react';

interface TerminalBoxProps {
  title: string;
  value: string | React.ReactNode;
  href?: string;
  className?: string;
}

export default function TerminalBox({
  title,
  value,
  href,
  className = '',
}: TerminalBoxProps) {
  const content = (
    <div className={`border-l-2 border-terminal-green-dim pl-3 hover:border-terminal-green transition-all ${className}`}>
      <div className="text-blue text-sm">{title}</div>
      <div className="text-terminal-green mt-1">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  );

  return content;
}
