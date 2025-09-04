# 🖥️ macOS-Style Portfolio

A modern, interactive portfolio website that mimics the macOS Catalina interface, built with React and TypeScript. This project provides a unique way to showcase your work and skills through a familiar desktop environment.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue) ![Vite](https://img.shields.io/badge/Vite-5.2.10-purple)

## ✨ Features

- **🖥️ macOS Interface**: Authentic macOS Catalina look and feel
- **📱 Responsive Design**: Works seamlessly across desktop and mobile devices
- **🌙 Dark/Light Mode**: Dynamic theme switching with brightness control
- **🪟 Window Management**: Drag, resize, minimize, maximize, and close windows
- **🚀 Launchpad**: App launcher with smooth animations
- **🔍 Spotlight Search**: Quick app and content search functionality
- **📝 Markdown Support**: Rich text editing with syntax highlighting
- **🎵 Audio Integration**: Background music and system sounds
- **📊 Real-time Data**: Battery status, system time, and more

## 🛠️ Tech Stack

### Frontend

- **React 18.3.1** - UI framework
- **TypeScript 5.4.5** - Type safety
- **Vite 5.2.10** - Build tool and dev server
- **UnoCSS** - Atomic CSS framework
- **Framer Motion** - Animations and transitions

### Key Libraries

- **Zustand** - State management
- **React RND** - Resizable and draggable components
- **Milkdown** - Markdown editor
- **React Syntax Highlighter** - Code syntax highlighting
- **React Webcam** - Camera integration
- **Date-fns** - Date manipulation

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Lint-staged** - Pre-commit linting

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/chu0jz013/chu0jz013.github.io.git
   cd chu0jz013.github.io
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to see the portfolio in action.

### Build for Production

```bash
pnpm build
# or
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── apps/           # Application components (Bear, Safari, VSCode, etc.)
│   ├── dock/           # Dock and dock items
│   ├── menus/          # Menu bar components
│   ├── AppWindow.tsx   # Window wrapper component
│   ├── Launchpad.tsx   # App launcher
│   └── Spotlight.tsx   # Search functionality
├── configs/            # Configuration files
│   ├── apps.tsx        # App definitions and settings
│   ├── user.ts         # User profile configuration
│   ├── wallpapers.ts   # Wallpaper settings
│   └── websites.ts     # Website links and icons
├── hooks/              # Custom React hooks
├── pages/              # Main page components
│   ├── Boot.tsx        # Boot screen
│   ├── Desktop.tsx     # Main desktop interface
│   └── Login.tsx       # Login screen
├── stores/             # Zustand state stores
├── styles/             # CSS and styling
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🎨 Customization

### Adding New Apps

1. **Create the app component** in `src/components/apps/`
2. **Add app configuration** in `src/configs/apps.tsx`
3. **Include app icon** in `public/img/icons/`

Example app configuration:

```typescript
{
  id: "my-app",
  title: "My App",
  desktop: true,
  width: 800,
  height: 600,
  img: "img/icons/my-app.png",
  content: <MyApp />
}
```

### Customizing Appearance

- **Wallpapers**: Update `src/configs/wallpapers.ts`
- **User Info**: Modify `src/configs/user.ts`
- **Styling**: Edit `src/styles/` files or use UnoCSS classes
- **Icons**: Replace icons in `public/img/icons/`

### Adding Content

- **About Me**: Edit `public/markdown/about-me.md`
- **Resume**: Update `public/markdown/resume.md`
- **Site Info**: Modify `public/markdown/about-site.md`

## 🌐 Deployment

### GitHub Pages

This project is configured for GitHub Pages deployment:

1. **Build the project**

   ```bash
   pnpm build
   ```

2. **Commit and push**

   ```bash
   git add dist/
   git commit -m "Deploy to GitHub Pages"
   git push origin master
   ```

3. **Enable GitHub Pages** in repository settings to serve from the `dist/` folder

### Other Platforms

The built files in `dist/` can be deployed to any static hosting service:

- **Vercel**
- **Netlify**
- **AWS S3 + CloudFront**
- **Firebase Hosting**

## 📱 Apps Included

- **🐻 Bear** - Markdown note-taking app
- **📝 Typora** - Rich text editor
- **🌐 Safari** - Web browser
- **💻 VSCode** - Code editor
- **📹 FaceTime** - Video calling app
- **⚡ Terminal** - Command line interface
- **🚀 Launchpad** - App launcher

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- **Original Creator**: [Renovamen](https://portfolio.zxh.me/) - The original macOS playground project
- **Icons**: Generated with [sindresorhus/file-icon-cli](https://github.com/sindresorhus/file-icon-cli)
- **Inspiration**: macOS Catalina design language

## 📞 Contact

**William Kieu** - DevOps Cloud Engineer

- 📧 Email: [williamkieu-devops@outlook.com](mailto:williamkieu-devops@outlook.com)
- 💻 GitHub: [@chu0jz013](https://github.com/chu0jz013)
- 🔗 LinkedIn: [williamkieuu](https://www.linkedin.com/in/williamkieuu/)
- 🌐 Website: [williamkieuu-devops.cloud](https://williamkieuu-devops.cloud) <!-- TODO: Use WEBSITE_URL constant from src/utils/constants.ts -->

---

## 📖 About This Site

Originally created by [Renovamen](https://portfolio.zxh.me/), this portfolio has been customized and adapted to fit my own style. (I just copy it)

⭐ **Star this repository if you found it helpful!**
