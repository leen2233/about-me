import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="crt-screen min-h-screen w-full bg-terminal-bg">
      <div className="scanline"></div>
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_90%,rgba(0,0,0,0.6)_100%)]"></div>
      </div>

      <div className="screen-curvature min-h-screen overflow-y-auto overflow-x-hidden p-4 md:p-8">
        <div className="font-mono text-sm md:text-base max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[50vh]">
          <div className="text-red text-6xl mb-4 glow-text">404</div>
          <h1 className="glow-text-amber text-2xl mb-4">Page Not Found</h1>
          <p className="text-dim mb-6 text-center">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-4 py-2 bg-terminal-green text-terminal-bg rounded hover:bg-terminal-green-dim transition-all"
            >
              Go Home
            </Link>
            <Link
              href="/projects"
              className="px-4 py-2 border border-terminal-green rounded hover:bg-terminal-green-dim hover:text-terminal-bg transition-all"
            >
              View Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
