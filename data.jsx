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
    name: "comixie",
    status: "running",
    date: "Jun 23 2025",
    url: "https://github.com/leen2233/comixie-backend",
    live: "https://comixie.leen2233.me",
    description:
      "A comic reading website for reading any comic online. Built with Django and React, featuring a modern design and extensive comic library.",
    details: `# Comixie

🌐 **Try it now:** [comixie.leen2233.me](https://comixie.leen2233.me)

A modern, responsive web application for discovering, searching, and reading comics. Built with React and Vite, Comixie offers a beautiful, immersive reading experience and a seamless interface for comic lovers.

## 🔗 Access
- 💻 [Web App](https://comixie.leen2233.me)

## 🔗 Repository Links
- [Backend Repository](https://github.com/leen2233/comixie-backend)
- [Web Repository](https://github.com/leen2233/comixie-frontend)

## 🚀 Current Features

### Comic Discovery

- **Home Page**: Browse a curated list of comics with infinite scroll
- **Instant Search**: Real-time search with suggestions and dropdown results

### Comic Details

- **Detailed View**: See comic cover, title, genres, publisher, and description
- **Chapters List**: Browse and jump to any chapter

### Reader

- **Immersive Reading**: Read comic chapters with smooth navigation
- **Reading Modes**: Fit width, fit height, or original size
- **Zoom & Scale**: Adjustable image scaling
- **Fullscreen Mode**: Distraction-free reading
- **Keyboard Shortcuts**: Navigate pages, zoom, and toggle fullscreen with keys
- **PDF Export**: Export chapters as PDF
- **Progress Tracking**: Page counter and quick navigation

### User Experience

- **Responsive Design**: Works beautifully on desktop and mobile
- **Modern UI**: Clean, visually appealing interface
- **Loading States**: Elegant spinners and feedback
- **Error Handling**: Friendly error messages and fallback options

### Navigation

- **Intuitive Routing**: Quick access to Home, Search, Comic Details, and Reader
- **Persistent State**: URL-based navigation for shareable links

## 🔧 Technical Stack
### Web
- React

### Backend
- Flask`,
  },
  {
    name: "veia",
    status: "running",
    date: "May 5 2025",
    url: "https://github.com/leen2233/veia-backend",
    description:
      "A modern chat application in its early stage, featuring backend, Android, and desktop client repositories.",
    details: `# Veia
    
Veia is a modern chat application currently in active development.

## 🔗 Project Links
- [Backend Repository](https://github.com/leen2233/veia-backend)
- [Mobile App Repository](https://github.com/leen2233/veia-mobile)
- [Desktop App Repository](https://github.com/leen2233/veia-desktop)

More features and details coming soon.`,
  },
];

export default projects;
