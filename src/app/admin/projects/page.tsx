'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
  status: 'completed' | 'running';
  date: string;
  url: string;
  live?: string;
  description: string;
  features?: string[];
  repos?: string[];
  created_at: string;
  updated_at: string;
}

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    status: 'running' as 'completed' | 'running',
    date: '',
    url: '',
    live: '',
    description: '',
    features: '',
    repos: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      if (!data.authenticated) {
        router.push('/login');
        return;
      }
      await fetchProjects();
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    } finally {
      setAuthChecking(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProject
      ? `/api/admin/projects/${editingProject.id}`
      : '/api/admin/projects';
    const method = editingProject ? 'PUT' : 'POST';

    const features = formData.features
      ? formData.features.split(',').map(f => f.trim()).filter(Boolean)
      : [];
    const repos = formData.repos
      ? formData.repos.split(',').map(r => r.trim()).filter(Boolean)
      : [];

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          features: features.length > 0 ? features : undefined,
          repos: repos.length > 0 ? repos : undefined,
          live: formData.live || undefined,
        }),
      });

      if (res.ok) {
        await fetchProjects();
        resetForm();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to save project');
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      id: project.id,
      name: project.name,
      status: project.status,
      date: project.date,
      url: project.url,
      live: project.live || '',
      description: project.description,
      features: project.features?.join(', ') || '',
      repos: project.repos?.join(', ') || '',
    });
    setShowEditor(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchProjects();
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      status: 'running',
      date: '',
      url: '',
      live: '',
      description: '',
      features: '',
      repos: '',
    });
    setEditingProject(null);
    setShowEditor(false);
  };

  const generateId = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  if (authChecking) {
    return (
      <div className="crt-screen min-h-screen w-full bg-terminal-bg flex items-center justify-center">
        <div className="scanline"></div>
        <div className="text-dim">Checking authentication...</div>
      </div>
    );
  }

  if (showEditor) {
    return (
      <div className="crt-screen min-h-screen w-full bg-terminal-bg">
        <div className="scanline"></div>
        <div className="fixed inset-0 pointer-events-none z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.1)_90%,rgba(0,0,0,0.15)_100%)]"></div>
        </div>

        <div className="screen-curvature min-h-screen overflow-y-auto overflow-x-hidden p-4 md:p-8">
          <div className="font-mono text-sm md:text-base max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-terminal-border">
              <h1 className="glow-text-amber text-xl">
                {editingProject ? 'Edit Project' : 'New Project'}
              </h1>
              <button
                onClick={resetForm}
                className="px-3 py-1 border border-terminal-red text-terminal-red rounded hover:bg-terminal-red hover:text-terminal-bg transition-all text-sm"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-blue mb-1">Project Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      id: !editingProject ? generateId(name) : prev.id,
                    }));
                  }}
                  className="w-full bg-black bg-opacity-30 border border-terminal-border rounded px-3 py-2 text-terminal-fg focus:outline-none focus:border-terminal-green"
                  required
                />
              </div>

              <div>
                <label className="block text-blue mb-1">Project ID *</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, id: e.target.value }))}
                  className="w-full bg-black bg-opacity-30 border border-terminal-border rounded px-3 py-2 text-terminal-fg focus:outline-none focus:border-terminal-green font-mono text-sm"
                  required
                  disabled={!!editingProject}
                />
                {editingProject && (
                  <p className="text-dim text-xs mt-1">ID cannot be changed after creation</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue mb-1">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as 'completed' | 'running' }))}
                    className="w-full bg-black bg-opacity-30 border border-terminal-border rounded px-3 py-2 text-terminal-fg focus:outline-none focus:border-terminal-green"
                    required
                  >
                    <option value="running">Running</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-blue mb-1">Date *</label>
                  <input
                    type="text"
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    placeholder="e.g. Jan 1 2025"
                    className="w-full bg-black bg-opacity-30 border border-terminal-border rounded px-3 py-2 text-terminal-fg focus:outline-none focus:border-terminal-green"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-blue mb-1">GitHub URL *</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                  placeholder="https://github.com/..."
                  className="w-full bg-black bg-opacity-30 border border-terminal-border rounded px-3 py-2 text-terminal-fg focus:outline-none focus:border-terminal-green"
                  required
                />
              </div>

              <div>
                <label className="block text-blue mb-1">Live Demo URL (optional)</label>
                <input
                  type="url"
                  value={formData.live}
                  onChange={(e) => setFormData((prev) => ({ ...prev, live: e.target.value }))}
                  placeholder="https://..."
                  className="w-full bg-black bg-opacity-30 border border-terminal-border rounded px-3 py-2 text-terminal-fg focus:outline-none focus:border-terminal-green"
                />
              </div>

              <div>
                <label className="block text-blue mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-black bg-opacity-30 border border-terminal-border rounded px-3 py-2 text-terminal-fg focus:outline-none focus:border-terminal-green min-h-24"
                  required
                />
              </div>

              <div>
                <label className="block text-blue mb-1">Features (optional, comma-separated)</label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData((prev) => ({ ...prev, features: e.target.value }))}
                  placeholder="Feature 1, Feature 2, Feature 3"
                  className="w-full bg-black bg-opacity-30 border border-terminal-border rounded px-3 py-2 text-terminal-fg focus:outline-none focus:border-terminal-green"
                />
              </div>

              <div>
                <label className="block text-blue mb-1">Repos (optional, comma-separated)</label>
                <input
                  type="text"
                  value={formData.repos}
                  onChange={(e) => setFormData((prev) => ({ ...prev, repos: e.target.value }))}
                  placeholder="Backend, Frontend, Mobile"
                  className="w-full bg-black bg-opacity-30 border border-terminal-border rounded px-3 py-2 text-terminal-fg focus:outline-none focus:border-terminal-green"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-terminal-green text-terminal-bg rounded hover:opacity-90 transition-all"
                >
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="crt-screen min-h-screen w-full bg-terminal-bg">
      <div className="scanline"></div>
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.1)_90%,rgba(0,0,0,0.15)_100%)]"></div>
      </div>

      <div className="screen-curvature min-h-screen overflow-y-auto overflow-x-hidden p-4 md:p-8">
        <div className="font-mono text-sm md:text-base max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-terminal-border">
            <div>
              <Link href="/" className="text-dim hover:text-terminal-green">
                ~/home
              </Link>
              <span className="mx-2">/</span>
              <span className="glow-text-amber">Admin / Projects</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditor(true)}
                className="px-3 py-1 bg-terminal-green text-terminal-bg rounded hover:opacity-90 transition-all"
              >
                + New Project
              </button>
              <Link
                href="/admin/blog"
                className="px-3 py-1 border border-terminal-border rounded hover:bg-terminal-green hover:text-terminal-bg transition-all"
              >
                Blog Admin
              </Link>
              <button
                onClick={handleLogout}
                className="px-3 py-1 border border-terminal-border rounded hover:bg-terminal-red hover:text-terminal-bg transition-all text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {loading ? (
            <div className="text-dim">Loading...</div>
          ) : projects.length === 0 ? (
            <div className="text-dim">
              <p>No projects yet. Create your first project!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-terminal-border rounded p-4 hover:border-terminal-green transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-blue">{project.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            project.status === 'completed'
                              ? 'bg-terminal-green text-terminal-bg'
                              : 'bg-terminal-amber text-terminal-bg'
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <div className="text-dim text-sm">
                        {project.id} • {project.date}
                      </div>
                      <div className="text-dim text-sm mt-1 line-clamp-1">
                        {project.description}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue hover:underline text-sm"
                      >
                        GitHub
                      </a>
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue hover:underline text-sm"
                        >
                          Live
                        </a>
                      )}
                      <button
                        onClick={() => handleEdit(project)}
                        className="text-amber hover:underline text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-red hover:underline text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 pt-4 border-t border-terminal-border text-sm">
            <Link href="/" className="text-dim hover:text-terminal-green">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
