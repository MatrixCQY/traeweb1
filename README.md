# MathStudio

**A professional Markdown editor designed for mathematics and coding.**

[**Live Demo / 在线体验**](https://matrixcqy.github.io/MathStudio/)

![MathStudio Preview](https://matrixcqy.github.io/MathStudio/preview-image-placeholder)
*(Note: You can add a screenshot here later)*

## Features

- **LaTeX Support**: Write mathematical formulas easily with inline `$E=mc^2$` or block syntax.
- **Code Highlighting**: Syntax highlighting for various programming languages.
- **VS Code Style**: A clean, professional editing experience with dark mode support.
- **Live Preview**: Real-time rendering of your Markdown content.
- **File Management**: 
  - Virtual file system (files/folders) persisted in browser.
  - Search functionality.
  - Import/Export capability (download `.md` files).
- **Responsive Design**: Works on desktop, tablets, and mobile devices (with split-view support).

## Getting Started

To run this project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/MatrixCQY/MathStudio.git
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Markdown**: `react-markdown`, `remark-math`, `rehype-katex`, `rehype-highlight`
- **Icons**: [Lucide React](https://lucide.dev)
