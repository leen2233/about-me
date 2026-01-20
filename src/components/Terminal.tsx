'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Types for terminal output
type TerminalOutput = {
  id: string;
  type: 'command' | 'output' | 'error' | 'success' | 'info' | 'html';
  content: string | React.ReactNode;
  timestamp?: string;
};

type TerminalCommand = {
  cmd: string;
  args: string[];
};

// Props for the terminal component
interface TerminalProps {
  initialOutputs?: TerminalOutput[];
  onCommand?: (cmd: TerminalCommand) => string | React.ReactNode | null;
  placeholder?: string;
  showWelcome?: boolean;
}

const DEFAULT_PLACEHOLDER = 'guest@leen-dev:~$';

// Command suggestions for tab completion
const COMMANDS = [
  'help',
  'about',
  'projects',
  'project',
  'blog',
  'read',
  'clear',
  'ls',
  'pwd',
  'whoami',
  'contact',
  'skills',
  'experience',
  'exit',
];

const Terminal: React.FC<TerminalProps> = ({
  initialOutputs = [],
  onCommand,
  placeholder = DEFAULT_PLACEHOLDER,
  showWelcome = true,
}) => {
  const [outputs, setOutputs] = useState<TerminalOutput[]>(initialOutputs);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [tabOptions, setTabOptions] = useState<string[]>([]);
  const [tabIndex, setTabIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Focus input on mount and click
  useEffect(() => {
    inputRef.current?.focus();

    const handleClick = () => inputRef.current?.focus();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // Scroll to bottom when outputs change
  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [outputs]);

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const trimmedInput = input.trim();

        if (trimmedInput) {
          // Add to history
          setHistory((prev) => [...prev, trimmedInput]);
          setHistoryIndex(-1);

          // Parse command
          const parts = trimmedInput.split(/\s+/);
          const cmd = parts[0].toLowerCase();
          const args = parts.slice(1);

          // Add command to output
          const commandOutput: TerminalOutput = {
            id: Date.now().toString(),
            type: 'command',
            content: `${placeholder} ${trimmedInput}`,
            timestamp: new Date().toLocaleTimeString(),
          };

          setOutputs((prev) => [...prev, commandOutput]);

          // Process command
          let result: string | React.ReactNode | null = null;

          if (onCommand) {
            result = onCommand({ cmd, args });
          } else {
            // Default command handling
            result = handleDefaultCommand(cmd, args);
          }

          if (result) {
            const output: TerminalOutput = {
              id: (Date.now() + 1).toString(),
              type: 'output',
              content: result,
            };
            setOutputs((prev) => [...prev, output]);
          }
        }

        setInput('');
        setTabOptions([]);
        setTabIndex(0);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length > 0) {
          const newIndex = historyIndex + 1;
          if (newIndex < history.length) {
            setHistoryIndex(newIndex);
            setInput(history[history.length - 1 - newIndex]);
          }
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(history[history.length - 1 - newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setInput('');
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        handleTabCompletion(input);
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        setOutputs([]);
      }
    },
    [input, history, historyIndex, placeholder, onCommand]
  );

  const handleTabCompletion = (currentInput: string) => {
    const parts = currentInput.split(/\s+/);
    const partial = parts[parts.length - 1].toLowerCase();

    if (partial.length === 0) {
      setTabOptions(COMMANDS);
    } else {
      const matches = COMMANDS.filter((c) => c.startsWith(partial));
      setTabOptions(matches);
    }

    if (tabOptions.length === 1) {
      const completed = parts.slice(0, -1).concat(tabOptions[0]).join(' ');
      setInput(completed + ' ');
      setTabOptions([]);
      setTabIndex(0);
    }
  };

  const handleDefaultCommand = (
    cmd: string,
    args: string[]
  ): string | React.ReactNode | null => {
    switch (cmd) {
      case 'help':
        return (
          <div className="flex flex-col gap-1">
            <div className="glow-text-amber">Available Commands:</div>
            <div className="grid grid-cols-[150px_1fr] gap-1">
              <span className="text-blue">about</span>
              <span>Display information about me</span>
              <span className="text-blue">projects</span>
              <span>List all projects</span>
              <span className="text-blue">project &lt;id&gt;</span>
              <span>View project details</span>
              <span className="text-blue">blog</span>
              <span>List blog posts</span>
              <span className="text-blue">read &lt;slug&gt;</span>
              <span>Read a blog post</span>
              <span className="text-blue">skills</span>
              <span>Show technical skills</span>
              <span className="text-blue">experience</span>
              <span>Show work experience</span>
              <span className="text-blue">contact</span>
              <span>Show contact information</span>
              <span className="text-blue">clear</span>
              <span>Clear terminal screen</span>
              <span className="text-blue">ls / pwd / whoami</span>
              <span>Unix-like commands</span>
            </div>
          </div>
        );

      case 'clear':
        setOutputs([]);
        return null;

      case 'ls':
        return 'about-me/  projects/  blog/';

      case 'pwd':
        return '/home/guest/leen-dev';

      case 'whoami':
        return 'guest';

      default:
        return (
          <span className="text-red">
            Command not found: {cmd}. Type <span className="text-blue">{'"help"'}</span> for
            available commands.
          </span>
        );
    }
  };

  const handleQuickCommand = (cmd: string) => {
    setInput(cmd);
    setTimeout(() => {
      if (inputRef.current) {
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        inputRef.current.dispatchEvent(event);
      }
    }, 10);
  };

  return (
    <div className="crt-screen h-full w-full bg-terminal-bg">
      {/* Scanline overlay */}
      <div className="scanline"></div>

      {/* Screen curvature vignette */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_90%,rgba(0,0,0,0.6)_100%)]"></div>
      </div>

      {/* Main content area */}
      <div className="screen-curvature h-full overflow-y-auto overflow-x-hidden p-4 md:p-8">
        {/* Terminal output */}
        <div className="font-mono text-sm md:text-base min-h-[calc(100vh-200px)]">
          {outputs.map((output) => (
            <div key={output.id} className="mb-2 animate-flicker">
              {output.type === 'command' ? (
                <div className="text-dim">{output.content}</div>
              ) : output.type === 'error' ? (
                <div className="text-red">{output.content}</div>
              ) : output.type === 'success' ? (
                <div className="glow-text">{output.content}</div>
              ) : output.type === 'info' ? (
                <div className="text-blue">{output.content}</div>
              ) : (
                <div className="whitespace-pre-wrap">{output.content}</div>
              )}
            </div>
          ))}
          <div ref={outputEndRef}></div>

          {/* Tab completion suggestions */}
          {tabOptions.length > 1 && (
            <div className="text-dim mb-2">
              {tabOptions.map((opt, i) => (
                <span
                  key={opt}
                  className={i === tabIndex ? 'glow-text mx-1' : 'mx-1'}
                >
                  {opt}
                </span>
              ))}
            </div>
          )}

          {/* Input line */}
          <div className="flex items-center">
            <span className="glow-text mr-2 whitespace-nowrap">{placeholder}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-terminal-green font-mono"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <span className="cursor"></span>
          </div>

          {/* Quick action buttons */}
          {showWelcome && (
            <div className="mt-8 pt-4 border-t border-terminal-green-dim border-dashed">
              <div className="text-dim text-xs mb-3">
                [ Quick navigation - click to execute ]
              </div>
              <div className="flex flex-wrap gap-2">
                {['about', 'projects', 'blog', 'skills'].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleQuickCommand(cmd)}
                    className="px-3 py-1 border border-terminal-green-dim rounded hover:bg-terminal-green hover:text-terminal-bg transition-all text-sm"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Terminal;
