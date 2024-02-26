# KTON Staking Dashboard

## Introduction

Welcome to the KTON Staking Dashboard! This decentralized finance (DeFi) application enables users to easily stake KTON tokens and earn rewards. With a user-friendly interface, it simplifies your interaction with various blockchain tokens, making DeFi more accessible.

## Project Structure

This project is organized as follows:

- `.env` - Environment variables configuration
- `.eslintrc.json` - ESLint configuration for code linting
- `.gitignore` - Specifies intentionally untracked files to ignore
- `.next/` - Next.js build output directory
- `.prettierrc.cjs` - Prettier configuration for code formatting
- `.vscode/` - VSCode specific settings
  - `settings.json` - Editor configuration
- `components.json` - Component configuration
- `next.config.mjs` - Next.js configuration file
- `package.json` - Defines npm package dependencies
- `pnpm-lock.yaml` - Lock file for pnpm
- `postcss.config.js` - PostCSS configuration for processing CSS
- `public/` - Static files like images and icons
- `README.md` - Project documentation
- `src/` - Source code directory
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript compiler configuration

## Getting Started

To set up the project:

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install the dependencies using pnpm:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm run dev
   ```

4. Open http://localhost:3000 with your browser to see the result.

## Building the Project

After you have made changes to the project or if you wish to deploy it, you can build the project using:

```bash
pnpm run build
```

This command generates a `.next` directory with your optimized production build. Next.js pre-renders your pages to static HTML, making it ready for deployment.

## Starting the Project

To start the project in production mode, run:

```bash
pnpm start
```

This command starts a Next.js production server that serves your built site on `http://localhost:3000`. Ensure you have run `pnpm run build` before starting the server in production mode.
