'use client';

import { useState, useEffect } from 'react';
import TerminalNav from '@/components/TerminalNav';
import TerminalCard from '@/components/TerminalCard';
import { projects } from '@/lib/data';
import { Metadata } from 'next';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  // Handle URL hash for direct project links
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const project = projects.find((p) => p.id === hash);
      if (project) {
        setSelectedProject(project);
        // Scroll to project detail
        setTimeout(() => {
          document.getElementById('project-detail')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="crt-screen min-h-screen w-full bg-terminal-bg">
      <div className="scanline"></div>
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_90%,rgba(0,0,0,0.6)_100%)]"></div>
      </div>

      <div className="screen-curvature min-h-screen overflow-y-auto overflow-x-hidden p-4 md:p-8">
        <div className="font-mono text-sm md:text-base max-w-4xl mx-auto">
          <TerminalNav />

          {/* Header */}
          <div className="mb-8">
            <h1 className="glow-text-amber text-3xl mb-2">~/projects</h1>
            <p className="text-dim">My personal and open-source projects</p>
          </div>

          {/* Project List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`border rounded p-4 cursor-pointer transition-all ${
                  selectedProject?.id === project.id
                    ? 'border-terminal-green bg-terminal-green bg-opacity-10'
                    : 'border-terminal-green-dim hover:border-terminal-green'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue">{project.name}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      project.status === 'running'
                        ? 'bg-terminal-green text-terminal-bg'
                        : 'bg-terminal-green-dim'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-dim text-sm mb-3">{project.description}</p>
                <div className="flex gap-3 text-sm">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-amber hover:underline"
                  >
                    [GitHub]
                  </a>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue hover:underline"
                    >
                      [Live]
                    </a>
                  )}
                  <span className="text-dim">[{new Date(project.date).toLocaleDateString()}]</span>
                </div>
              </div>
            ))}
          </div>

          {/* Project Detail */}
          {selectedProject && (
            <div id="project-detail" className="mb-8">
              <TerminalCard
                title={`${selectedProject.name}/README.md`}
                icon="📄"
                className="mb-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl text-blue">{selectedProject.name}</h2>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-dim hover:text-terminal-green text-sm"
                  >
                    [close]
                  </button>
                </div>

                <div className="grid grid-cols-[100px_1fr] gap-2 text-sm mb-4">
                  <span className="text-dim">Status:</span>
                  <span className={selectedProject.status === 'running' ? 'glow-text' : 'text-dim'}>
                    {selectedProject.status}
                  </span>

                  <span className="text-dim">Created:</span>
                  <span className="text-dim">{selectedProject.date}</span>

                  <span className="text-dim">Links:</span>
                  <div className="flex gap-3">
                    <a
                      href={selectedProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber hover:underline"
                    >
                      [GitHub]
                    </a>
                    {selectedProject.live && (
                      <a
                        href={selectedProject.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue hover:underline"
                      >
                        [Live Demo]
                      </a>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-blue text-sm mb-2">Description</div>
                  <p className="text-dim">{selectedProject.description}</p>
                </div>

                {selectedProject.features && (
                  <div>
                    <div className="text-blue text-sm mb-2">Features</div>
                    <ul className="list-disc list-inside text-dim text-sm space-y-1">
                      {selectedProject.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedProject.repos && (
                  <div className="mt-4">
                    <div className="text-blue text-sm mb-2">Repositories</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.repos.map((repo, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-terminal-green-dim bg-opacity-20 rounded text-sm"
                        >
                          {repo}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </TerminalCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
