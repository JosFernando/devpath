<div align="center">

  <img src="./docs/images/platform-roadmap.png" alt="DevPath Platform Overview" width="100%" style="border-radius: 8px; border: 1px solid #e5e5e5;" />

  <br/><br/>

  # DevPath
  ### The Interactive Developer Roadmap & Hands-On Coding Platform

  [![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Monaco Editor](https://img.shields.io/badge/Monaco_Editor-VS_Code_Engine-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](https://microsoft.github.io/monaco-editor/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](#license)

  <p align="center">
    <strong>Master modern programming through guided roadmaps, real-time feedback, and in-browser coding exercises.</strong>
  </p>

  <p align="center">
    <sub>Crafted with ❤️ by <a href="https://github.com/JosFernando">José Fernando</a></sub>
  </p>

</div>

---

## 🌟 Overview

**DevPath** is an open-source, hands-on learning platform designed to bridge the gap between passive tutorial watching and true software engineering competence.

Instead of reading dry theory or getting overwhelmed by disconnected exercises, DevPath takes learners on an **interactive, milestone-driven journey**. Each stage pairs in-depth architectural concepts with a full-fledged in-browser code editor, interactive terminal execution, automated validation assertions, and progressive guidance.

---

## 📸 Platform Screenshots

### 1. Hands-On Interactive Playground & Monaco Code Editor
Rich in-browser coding environment powered by Monaco Editor (VS Code), featuring syntax highlighting, multi-file support (script.js, index.html, style.css), deep lessons, and live interactive console output.

<div align="center">
  <img src="./docs/images/platform-playground.png" alt="DevPath Interactive Playground" width="100%" style="border-radius: 8px; border: 1px solid #e5e5e5;" />
</div>

<br/>

### 2. Live Automated Validation & Challenge Checklist
Each milestone provides clear objectives, progressive hints, and automated assertions that test code validity on demand (Ctrl + Enter).

<div align="center">
  <img src="./docs/images/platform-challenge.png" alt="DevPath Challenge & Checklist" width="100%" style="border-radius: 8px; border: 1px solid #e5e5e5;" />
</div>

<br/>

### 3. Visual Roadmap & Modular Curriculum
Structured milestone track taking developers step-by-step from core language fundamentals to advanced asynchronous patterns and OOP.

<div align="center">
  <img src="./docs/images/platform-roadmap.png" alt="DevPath Roadmap & Modules" width="100%" style="border-radius: 8px; border: 1px solid #e5e5e5;" />
</div>

<br/>

### 4. Required Practical Module Projects
Each module concludes with a hands-on project with explicit deliverables, milestones, and grading rubrics to consolidate real-world competence.

<div align="center">
  <img src="./docs/images/platform-project.png" alt="DevPath Module Project" width="100%" style="border-radius: 8px; border: 1px solid #e5e5e5;" />
</div>

---

## ✨ Key Features

- **🗺️ Visual Learning Roadmap:** Structured progression path dividing complex subjects into bite-sized, sequential milestones.
- **💻 Monaco Editor (VS Code in the Browser):** Powered by the same engine as Visual Studio Code, offering syntax highlighting, autocompletion, intelligent diagnostics, and keyboard shortcuts (Ctrl/Cmd + Enter to run).
- **🧪 Automated In-Browser Test Runner:** Validates solutions instantly against automated unit test cases and dynamic runtime assertions.
- **🖥️ Live Interactive Console:** Custom in-browser terminal capturing console.log, output evaluation, errors, and success statuses in real time.
- **📋 Step-by-step Validation Checklist:** Clear criteria for what constitutes a passing solution, guiding developers without spoiling the challenge.
- **💡 Progressive Hint System:** Tiered hints and curated external resources (MDN, JavaScript.info) when you need an extra nudge.
- **💾 Automatic Progress Tracking:** Clean, resilient local persistence using browser storage (localStorage) with full course reset support.
- **🎨 Modern, Minimalist UI:** Built with Tailwind CSS v4, responsive layout, dark-mode editor surfaces, and smooth transitions.

---

## 📚 Curriculum Breakdown

The JavaScript formation follows **10 modules across 4 phases**, progressing from first principles to application architecture, quality, and a final integration project. Every module ends with a **required practical project**. Each lesson pairs explanation and examples with a coding challenge; project briefs add deliverables, implementation milestones, review criteria, and optional extensions.

| Phase | Modules | Learning outcome |
| :--- | :--- | :--- |
| **01 · First steps** | 1–3 | Validate values, decompose problems into functions, and transform collections. |
| **02 · Browser applications** | 4–6 | Build interactive interfaces with events, persistence, and asynchronous data. |
| **03 · Architecture and quality** | 7–9 | Organize state and responsibilities, verify contracts, and reason about performance. |
| **04 · Master: practical integration** | 10 | Integrate concurrency, accessibility, and resilient persistence in a study dashboard. |

| Module | Topics covered | Required closing project |
| :--- | :--- | :--- |
| **01 · Language Fundamentals** | Variables, types, conversion, conditionals, and debugging | Monthly budget simulator |
| **02 · Functions & Problem Solving** | Parameters, return values, scope, decomposition, and composition | Rock, Paper, Scissors in the console |
| **03 · Loops, Arrays & Objects** | Iteration, object properties, collection methods, and aggregation | Shopping cart calculation engine |
| **04 · DOM, Events & Projects** | HTML/CSS foundations, DOM rendering, forms, and interactive state | Browser calculator |
| **05 · Web APIs & Persistence** | JSON, localStorage, timers, and invalid stored data | Persistent study journal |
| **06 · Asynchronous JavaScript & APIs** | Promises, async/await, fetch, HTTP responses, and loading/error states | API data dashboard |
| **07 · OOP & Advanced Topics** | Classes, closures, encapsulation, and application state | Task manager |
| **08 · Application Architecture** | Pure functions, immutable reducers, dependency injection, and subscriptions | Observable state library |
| **09 · Quality & Performance** | Behavioral contracts, tests, Map/Set, search, and debounce | Catalog search engine |
| **10 · Professional Integration & Master** | Concurrent requests, keyboard access, persistence recovery, and integration | Study dashboard |

Projects are part of the sequential path: passing the current stage's checks unlocks the next stage. Automated checks verify the required behaviors; learners also review each project's rubric, explain their decisions, and try additional cases. Optional extensions do not block progression. “Master” names the final integration phase, without implying a certification or guaranteed expertise.

The curriculum focuses on **JavaScript in the browser**. The detailed [formation guide (Português)](docs/formacao-javascript.md) explains the study method, project completion criteria, scope, and how existing progress is preserved when the curriculum expands.

---

## 🛠️ Tech Stack

- **Core Framework:** [React 19](https://react.dev/)
- **Bundler & Dev Server:** [Vite 8](https://vitejs.dev/)
- **Routing:** [React Router DOM v7](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Code Editor:** [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Linter & Performance:** [Oxlint](https://oxc.rs/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: 18.0.0 or higher
- **npm** (or pnpm / yarn)

### Installation

1. **Clone the repository:**
   `ash
   git clone https://github.com/JosFernando/devpath.git
   cd devpath
   `

2. **Install dependencies:**
   `ash
   npm install
   `

3. **Start the local development server:**
   `ash
   npm run dev
   `

4. **Open in browser:**
   Navigate to [http://localhost:5173](http://localhost:5173) to start exploring the roadmap!

### Building for Production

To create an optimized production build:
`ash
npm run build
`
You can preview the production bundle locally with:
`ash
npm run preview
`

---

## 📁 Project Structure

`	ext
devpath/
├── docs/                      # Documentation assets & platform screenshots
│   └── images/                # Real captured platform UI screenshots
├── public/                    # Static assets, favicon and icons
├── src/
│   ├── assets/                # Images and SVG icons
│   ├── components/            # Reusable UI components
│   │   ├── common/            # Shared components (Navbar, Header)
│   │   ├── CodecademyEditor.jsx # Monaco-powered multi-file code editor
│   │   ├── InteractiveConsole.jsx # Live terminal & test runner display
│   │   └── ValidationChecklist.jsx # Task criteria and dynamic checklist
│   ├── context/               # Global state (ProgressContext)
│   ├── data/                  # Curricula, roadmap nodes, and coding challenges
│   │   ├── curriculum.js      # Structured lesson data
│   │   └── roadmapData.js     # Comprehensive course tracks & test suites
│   ├── pages/                 # Route pages (RoadmapPage, StagePlaygroundPage)
│   ├── App.jsx                # Application root and route configuration
│   ├── index.css              # Global styles & Tailwind imports
│   └── main.jsx               # React DOM entrypoint
├── package.json               # Dependencies and scripts
└── vite.config.js             # Vite configuration
`

---

## 🤝 Contributing

Contributions, feature requests, and curriculum additions are warmly welcomed!

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'feat: add some amazing feature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

---

## 👤 Author

**José Fernando**
- GitHub: [@JosFernando](https://github.com/JosFernando)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

<div align="center">
  <sub>Made with ❤️ by <strong>José Fernando</strong> • Empowering developers one line of code at a time.</sub>
</div>
