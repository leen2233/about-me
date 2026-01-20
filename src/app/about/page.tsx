import TerminalNav from '@/components/TerminalNav';
import TerminalCard from '@/components/TerminalCard';
import { personal, workExperience, skills } from '@/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Rejebov Arslan',
  description: 'Learn more about Rejebov Arslan, a Python/Django Developer with expertise in backend development and RESTful APIs.',
};

export default function AboutPage() {
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
            <h1 className="glow-text-amber text-3xl mb-2">~/about</h1>
            <p className="text-dim">Get to know me better</p>
          </div>

          {/* Profile Card */}
          <TerminalCard title="profile.json" icon="👤" className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-blue text-sm mb-1">Name</div>
                <div className="text-terminal-green">{personal.name}</div>
              </div>
              <div>
                <div className="text-blue text-sm mb-1">Role</div>
                <div className="text-terminal-green">{personal.jobTitle}</div>
              </div>
              <div>
                <div className="text-blue text-sm mb-1">Location</div>
                <div className="text-terminal-green">Remote / Worldwide</div>
              </div>
              <div>
                <div className="text-blue text-sm mb-1">Availability</div>
                <div className="text-terminal-green">Open to opportunities</div>
              </div>
            </div>
          </TerminalCard>

          {/* Bio */}
          <div className="mb-8">
            <h2 className="glow-text-amber text-xl mb-4">~/about/bio.md</h2>
            <div className="border-l-2 border-terminal-green pl-4 text-dim leading-relaxed">
              <p className="mb-4">
                I&apos;m a passionate backend developer with a strong focus on Python and Django.
                I love building scalable, efficient web applications and solving complex problems.
              </p>
              <p className="mb-4">
                My journey in software development has taken me through various roles,
                from full-stack development to specializing in backend architecture.
                I enjoy working with modern technologies and best practices to deliver
                high-quality solutions.
              </p>
              <p className="mb-4">
                <span className="glow-text">Linux enthusiast</span> — I prefer open-source tools
                and spend most of my time in the terminal.
              </p>
              <p>
                When I&apos;m not coding, you can find me exploring new technologies,
                contributing to open-source projects, or sharing knowledge with the developer community.
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="mb-8">
            <h2 className="glow-text-amber text-xl mb-4">~/about/skills.json</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TerminalCard title="languages" icon="💻">
                <div className="flex flex-wrap gap-2">
                  {skills.languages.map((lang) => (
                    <span
                      key={lang}
                      className="px-3 py-1 bg-terminal-green-dim bg-opacity-20 rounded text-sm"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </TerminalCard>

              <TerminalCard title="frameworks" icon="⚙️">
                <div className="flex flex-wrap gap-2">
                  {skills.frameworks.map((fw) => (
                    <span
                      key={fw}
                      className="px-3 py-1 bg-terminal-green-dim bg-opacity-20 rounded text-sm"
                    >
                      {fw}
                    </span>
                  ))}
                </div>
              </TerminalCard>

              <TerminalCard title="databases" icon="🗄️">
                <div className="flex flex-wrap gap-2">
                  {skills.databases.map((db) => (
                    <span
                      key={db}
                      className="px-3 py-1 bg-terminal-green-dim bg-opacity-20 rounded text-sm"
                    >
                      {db}
                    </span>
                  ))}
                </div>
              </TerminalCard>

              <TerminalCard title="tools" icon="🔧">
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1 bg-terminal-green-dim bg-opacity-20 rounded text-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </TerminalCard>
            </div>

            <div className="mt-4">
              <div className="text-blue text-sm mb-2">Expertise</div>
              <ul className="list-disc list-inside text-dim space-y-1">
                {skills.expertise.map((exp) => (
                  <li key={exp}>{exp}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Work Experience */}
          <div>
            <h2 className="glow-text-amber text-xl mb-4">~/about/experience.log</h2>
            <div className="space-y-4">
              {workExperience.map((work, index) => (
                <div
                  key={index}
                  className="border border-terminal-green-dim rounded p-4 hover:border-terminal-green transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-blue text-lg">{work.role}</div>
                      <div className="text-dim">
                        <span className="glow-text">{work.company}</span> • {work.type}
                      </div>
                    </div>
                    <div className="text-dim text-sm">{work.duration}</div>
                  </div>
                  <ul className="list-disc list-inside text-dim text-sm space-y-1">
                    {work.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
