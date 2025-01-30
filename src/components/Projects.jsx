import { TypeAnimation } from "react-type-animation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      name: "hey-py",
      status: "completed",
      date: "Feb 15 2024",
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
      date: "Dec 10 2023",
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
      status: "running",
      date: "Mar 15 2024",
      url: "https://github.com/leen2233/flickture",
      description:
        "A comprehensive movie platform with Django backend and React Native mobile app for seamless movie browsing and management.",
      details: `# Flickture

A full-stack movie platform consisting of a Django-powered backend and React Native mobile application, providing a complete solution for movie browsing and management.

## 🎬 Backend (Django)

### Core Features
- User authentication and authorization
- Movie browsing and searching
- Detailed movie information
- User reviews and ratings
- Watchlist management

### Technical Stack
- Django REST framework API
- PostgreSQL database
- Celery task queue integration
- Redis caching
- Docker containerization

### Authentication & Security
- JWT-based authentication
- Social media login integration
- Role-based access control
- Session management

## 📱 Mobile App (React Native)

### User Interface
- Intuitive movie browsing
- Smooth animations
- Cross-platform compatibility
- Dark/Light theme support
- Responsive design

### Mobile Features
- Offline support
- Local data caching
- Background sync
- Image optimization
- State management with Redux

### Mobile Tech Stack
- React Native
- TypeScript
- Redux Toolkit
- React Navigation
- Axios
- AsyncStorage

## 📋 System Requirements

### Backend Requirements
- Python 3.8+
- PostgreSQL
- Redis
- Celery

### Mobile Requirements
- Node.js 14+
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

## 🔄 Development Status
Both backend and mobile applications are under active development with regular updates and feature additions.

## 📝 Links
- [Backend Repository](https://github.com/leen2233/flickture)
- [Mobile Repository](https://github.com/leen2233/flickture-mobile)

## 📝 License
MIT License`,
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
    <>
      <div className="command-section">
        <span className="prompt">$ </span>
        <TypeAnimation
          sequence={["ls -l ~/projects/"]}
          wrapper="span"
          speed={50}
          className="command-text"
          cursor={false}
        />
      </div>

      <div className="content-section projects animate-fade-in">
        <div className="terminal-output">
          {projects.map((project) => (
            <div className="project-entry" key={project.name}>
              <span className={`project-status ${project.status}`}>
                [{project.status}]
              </span>
              <span className="project-date">{project.date}</span>
              <span className="project-name">
                <a href={project.url} target="_blank" rel="noopener noreferrer">
                  {project.name}
                </a>
              </span>
              <span className="project-description">
                {project.description}
                <button
                  className={`view-details ${
                    selectedProject?.name === project.name ? "active" : ""
                  }`}
                  onClick={() => toggleDetails(project)}
                >
                  [{selectedProject?.name === project.name ? "close" : "view"}{" "}
                  details]
                </button>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="command-section">
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
      </div>

      {selectedProject && (
        <div className="content-section project-details animate-fade-in">
          <ReactMarkdown className="details-text">
            {selectedProject.details}
          </ReactMarkdown>
        </div>
      )}
    </>
  );
}

export default Projects;
