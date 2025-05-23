import { TypeAnimation } from "react-type-animation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      name: "hey-py",
      status: "completed",
      date: "Oct 20 2024",
      url: "https://github.com/leen2233/hey-py",
      description:
        "A command-line interface for DuckDuckGo's AI Chat. Built with Python to provide an easy-to-use CLI for AI interactions.",
      details: `# hey-py

Python port of [hey](https://github.com/b1ek/hey), a command-line interface for DuckDuckGo's AI Chat with enhanced features.

## ✨ Features

### 🤖 AI Models
- Multiple model support:
  - Claude 3 Haiku (default)
  - GPT-4 Mini
  - Mistral 8x7B
  - Llama 3.1 70B
- Customizable system prompts

### 💬 Chat Experience
- Rich markdown support in responses
- Conversation memory with auto-expiry
  - Stores last 10 messages
  - 24-hour automatic expiration
  - Manual clearing with \`hey --clear\`
  - Persistent storage in \`~/.cache/hey\`
- Real-time streaming responses

### 🛠️ Configuration
- Easy configuration via \`hey config\`
- HTTP and SOCKS proxy support
- Persistent settings in \`~/.config/hey\`
- Verbose mode for debugging

## 🚀 Installation

\`\`\`bash
pip install hey-py
\`\`\`

## 📖 Usage

### Basic Usage
\`\`\`bash
# Ask a question
hey What is Python?

# Clear conversation history
hey --clear

# Configure settings
hey config
\`\`\`

### Configuration Options
- Select AI model
- Set system prompt
- Configure proxy settings
- Accept Terms of Service

### Environment Variables
- \`HEY_CONFIG_PATH\`: Custom config directory (default: \`~/.config/hey\`)
- \`HEY_CACHE_PATH\`: Custom cache directory (default: \`~/.cache/hey\`)
- \`HEY_CONFIG_FILENAME\`: Custom config filename (default: \`conf.toml\`)
- \`HEY_CACHE_FILENAME\`: Custom cache filename (default: \`messages.json\`)

## 📝 License
GPLv3`,
    },
    {
      name: "dotfiles",
      status: "completed",
      date: "Jan 20 2024",
      url: "https://github.com/leen2233/dotfiles",
      description:
        "Personal configuration files and shell scripts for development environment setup and customization.",
      details: `# dotfiles

My personal dotfiles for development environment setup and customization.

## 🗂️ Contents

### 🛠️ Development Tools
- Neovim configuration with custom plugins
- Tmux setup with productivity enhancements
- Git configurations and aliases
- ZSH with custom themes and plugins

### ⚙️ Configurations
- Terminal emulator settings
- Development tool preferences
- System customizations
- Color schemes and themes

## 🔄 Updates
Actively maintained and regularly updated with new configurations and improvements.

## 📋 Requirements
- Git
- Zsh
- Neovim (>= 0.8.0)
- Tmux (>= 3.0)`,
    },
    {
      name: "pm2py",
      status: "completed",
      date: "Aug 10 2024",
      url: "https://github.com/leen2233/pm2py",
      description:
        "A Python implementation of PM2's programmatic API. Fork of the original project with additional improvements and features.",
      details: `# pm2py

Python implementation of PM2's programmatic API with enhanced features and improvements.

## ✨ Features

### 🔄 Process Management
- Start/Stop/Restart applications
- Load balancing capabilities
- Zero-downtime reload
- Process scaling

### 📊 Monitoring
- Real-time metrics
- Resource usage tracking
- Custom metric support
- Performance analytics

### 🗄️ Log Management
- Centralized logging
- Log rotation
- Stream processing
- Custom formatters

### 🛠️ Extended Features
- Enhanced error handling
- Improved TypeScript definitions
- Additional configuration options
- Better Windows support

## 🚀 Installation

\`\`\`bash
pip install pm2py
\`\`\`

## 📖 Usage

### Basic Examples
\`\`\`python
from pm2py import PM2

# Initialize PM2
pm2 = PM2()

# Start an application
pm2.start('app.py', {
    'name': 'myapp',
    'instances': 4,
    'watch': True
})

# Monitor processes
processes = pm2.list()

# Stop application
pm2.stop('myapp')
\`\`\`

### Advanced Features
- Custom metrics collection
- Cluster mode management
- Environment configuration
- Log management

## 🔧 Configuration
Supports all PM2 configuration options plus additional features:
- Enhanced logging options
- Extended metrics
- Custom handlers
- Advanced clustering

## 📝 License
MIT License`,
    },
    {
      name: "flickture",
      status: "completed",
      date: "Jan 1 2025",
      url: "https://github.com/leen2233/flickture",
      live: "https://flickture.leen2233.me",
      description:
        "A comprehensive cross-platform movie platform with web app, mobile apps, and Django backend for seamless movie browsing and management.",
      details: `# Flickture

🌐 **Try it now:** [flickture.leen2233.me](https://flickture.leen2233.me)

Flickture is a comprehensive cross-platform movie platform that provides a seamless experience for movie enthusiasts across web and mobile devices. Built with modern technologies, it offers full feature parity between web and mobile applications.

## 🔗 Cross-Platform Access
- 💻 [Web App](https://flickture.leen2233.me)
- 📱 Mobile Apps (iOS & Android)
- 🔄 Synced experience across all devices

## 🔗 Project Links
- [Web Application](https://flickture.leen2233.me)
- [Backend Repository](https://github.com/leen2233/flickture)
- [Web Repository](https://github.com/leen2233/flickture-web)
- [Mobile Repository](https://github.com/leen2233/flickture-mobile)

## ✨ Features

### 🎬 Movie Discovery & Information
- Browse trending, popular, top-rated, and upcoming movies
- Advanced search functionality with filters by genre
- Detailed movie information including plot, cast, ratings, and runtime
- View movie collections and related content
- Explore artist/cast member profiles and filmographies

### 📱 Personal Movie Management
- Create and maintain custom movie lists
- Track movies with watchlist functionality
- Mark movies as watched
- Rate and review movies
- Add movies to favorites
- Share movies with friends

### 👥 Social Features
- User profiles with movie statistics
- Follow other users
- View activity feed of followed users
- Like and comment on movies
- Share custom movie lists
- Community movie lists and staff picks

### 🛠️ Platform Features
- Responsive web design
- Progressive Web App (PWA) support
- Native mobile apps for iOS and Android
- Dark/Light theme across all platforms
- Offline support
- Cross-device synchronization

## 🔧 Technical Stack
### Web
- React
- Next.js
- TailwindCSS
- Redux Toolkit

### Mobile
- React Native
- React Navigation
- GlueStack UI
- Native features integration

### Backend
- Django REST Framework
- PostgreSQL
- Redis`,
    },
    {
      name: "veia",
      status: "running",
      date: "May 5 2025",
      url: "https://github.com/leen2233/veia-backend",
      // live: "https://flickture.leen2233.me",
      description:
        "Veia is curently under development and will be available soon.",
      details: `# Veia
Veia is curently under development and will be available soon.`,
    },
  ];

  const toggleDetails = (project) => {
    if (selectedProject?.name === project.name) {
      setSelectedProject(null);
    } else {
      setSelectedProject(project);
    }
  };

  return (
    <main>
      <section className="command-section">
        <span className="prompt">$ </span>
        <TypeAnimation
          sequence={["ls -l ~/projects/"]}
          wrapper="span"
          speed={50}
          className="command-text"
          cursor={false}
        />
      </section>

      <section className="content-section projects animate-fade-in">
        <div
          className="terminal-output"
          itemScope
          itemType="http://schema.org/CollectionPage"
        >
          <meta itemProp="name" content="Portfolio Projects" />
          <meta
            itemProp="description"
            content="Collection of software development projects by Rejebov Arslan"
          />

          {projects.map((project) => (
            <article
              className="project-entry"
              key={project.name}
              itemScope
              itemType="http://schema.org/SoftwareSourceCode"
            >
              <meta
                itemProp="programmingLanguage"
                content="Python, JavaScript, React"
              />
              <meta itemProp="author" content="Rejebov Arslan" />

              <span className={`project-status ${project.status}`}>
                [{project.status}]
              </span>
              <span className="project-date" itemProp="dateCreated">
                {project.date}
              </span>
              <span className="project-name">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  itemProp="codeRepository"
                >
                  {project.name}
                </a>
              </span>
              <span className="project-description">
                {project.live && (
                  <div>
                    <a
                      href={project.live}
                      itemProp="url"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.live}
                    </a>
                  </div>
                )}
                <span itemProp="description">{project.description}</span>
                <button
                  className={`view-details ${
                    selectedProject?.name === project.name ? "active" : ""
                  }`}
                  onClick={() => toggleDetails(project)}
                  aria-expanded={selectedProject?.name === project.name}
                  aria-controls={`details-${project.name}`}
                >
                  [{selectedProject?.name === project.name ? "close" : "view"}{" "}
                  details]
                </button>
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="command-section">
        <span className="prompt">$ </span>
        <TypeAnimation
          key={selectedProject ? selectedProject.name : "default"}
          sequence={[
            selectedProject
              ? `cat ~/projects/${selectedProject.name}/README.md`
              : "cat ~/projects/README.md",
          ]}
          wrapper="span"
          speed={60}
          className="command-text"
          cursor={false}
        />
      </section>

      {selectedProject && (
        <section
          className="content-section project-details animate-fade-in"
          id={`details-${selectedProject.name}`}
          aria-label={`Details for ${selectedProject.name}`}
        >
          <ReactMarkdown
            className="details-text"
            components={{
              h1: ({ node, ...props }) => <h1 itemProp="name" {...props} />,
              p: ({ node, ...props }) => <p itemProp="text" {...props} />,
              a: ({ node, ...props }) => (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  itemProp="url"
                  {...props}
                />
              ),
            }}
          >
            {selectedProject.details}
          </ReactMarkdown>
        </section>
      )}
    </main>
  );
}

export default Projects;
