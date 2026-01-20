import Link from 'next/link';
import TerminalNav from '@/components/TerminalNav';
import TerminalCard from '@/components/TerminalCard';
import { personal, projects } from '@/lib/data';

export default function Home() {
  return (
    <div className="crt-screen min-h-screen w-full bg-terminal-bg">
      <div className="scanline"></div>
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_90%,rgba(0,0,0,0.6)_100%)]"></div>
      </div>

      <div className="screen-curvature min-h-screen overflow-y-auto overflow-x-hidden p-4 md:p-8">
        <div className="font-mono text-sm md:text-base max-w-4xl mx-auto">
          <TerminalNav />

          {/* Hero Section */}
          <div className="mb-12">
            <h1 className="glow-text-amber text-3xl md:text-4xl mb-2">
              {personal.name}
            </h1>
            <p className="text-xl text-dim mb-4">{personal.jobTitle}</p>
            <p className="text-dim max-w-2xl">
              Backend Developer specializing in Python/Django with expertise in
              building scalable web applications, RESTful APIs, and modern web architectures.
            </p>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Link href="/about">
              <TerminalCard title="~/about" icon="👤">
                <div className="text-dim mb-2">Learn more about me</div>
                <div className="flex items-center gap-2 text-blue text-sm">
                  <span>About Me</span>
                  <span>→</span>
                </div>
              </TerminalCard>
            </Link>

            <Link href="/projects">
              <TerminalCard title="~/projects" icon="🚀">
                <div className="text-dim mb-2">Browse my projects</div>
                <div className="flex items-center gap-2 text-blue text-sm">
                  <span>{projects.length} Projects</span>
                  <span>→</span>
                </div>
              </TerminalCard>
            </Link>

            <Link href="/blog">
              <TerminalCard title="~/blog" icon="📝">
                <div className="text-dim mb-2">Read my thoughts</div>
                <div className="flex items-center gap-2 text-blue text-sm">
                  <span>Blog Posts</span>
                  <span>→</span>
                </div>
              </TerminalCard>
            </Link>
          </div>

          {/* Featured Projects Preview */}
          <div className="mb-12">
            <h2 className="glow-text-amber text-xl mb-4 flex items-center gap-2">
              <span>~/projects/featured</span>
              <span className="text-dim text-sm font-normal">
                (latest 3)
              </span>
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {projects.slice(0, 3).map((project) => (
                <Link key={project.id} href={`/projects#${project.id}`}>
                  <div className="border border-terminal-green-dim rounded p-4 hover:border-terminal-green transition-all group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-blue group-hover:text-terminal-green transition-all">
                            {project.name}
                          </span>
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
                        <p className="text-dim text-sm">{project.description}</p>
                      </div>
                      <span className="text-dim group-hover:text-terminal-green transition-all">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/projects"
                className="text-amber hover:text-terminal-green transition-all text-sm"
              >
                View all projects →
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h2 className="glow-text-amber text-xl mb-4">~/contact</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <a
                href={`mailto:${personal.contact.email}`}
                className="border border-terminal-green-dim rounded p-4 hover:border-terminal-green transition-all"
              >
                <div className="text-blue text-sm">Email</div>
                <div className="text-terminal-green mt-1">{personal.contact.email}</div>
              </a>
              <a
                href={personal.contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-terminal-green-dim rounded p-4 hover:border-terminal-green transition-all"
              >
                <div className="text-blue text-sm">GitHub</div>
                <div className="text-terminal-green mt-1">{personal.contact.github}</div>
              </a>
              <a
                href={personal.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-terminal-green-dim rounded p-4 hover:border-terminal-green transition-all"
              >
                <div className="text-blue text-sm">Website</div>
                <div className="text-terminal-green mt-1">{personal.contact.website}</div>
              </a>
              <div className="border border-terminal-green-dim rounded p-4">
                <div className="text-blue text-sm">Phone</div>
                <div className="text-terminal-green mt-1">{personal.contact.phone}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-terminal-green-dim text-center text-dim text-sm">
            <p>
              Built with Next.js + TypeScript + Tailwind CSS
            </p>
            <p className="mt-2">
              <Link href="/admin/blog" className="text-dim hover:text-terminal-green">
                [Admin]
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
