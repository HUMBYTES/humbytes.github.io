# HUMBYTES

A responsive digital-studio website built with React, Vite, Framer Motion, and Three.js.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal.

## Build

```sh
npm run lint
npm run build
npm run preview
```

The production website is generated in `dist/`.

## Publish with GitHub Pages

The included GitHub Actions workflow builds and publishes the site whenever a change is pushed to `main`.

1. Push this repository to GitHub.
2. In the repository, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.
3. Push to `main` or manually run **Deploy to GitHub Pages** from the **Actions** tab.


The Vite base path is set automatically in GitHub Actions and remains `/` for local development.

## Security

Production builds include a Content Security Policy that restricts scripts, styles, fonts, connections, and other resources to the site itself. The GitHub Actions workflow also audits dependencies before building. Run `npm audit` locally to check for newly disclosed dependency vulnerabilities.

This is a static site with no application server, accounts, or database. GitHub Pages does not provide configurable security response headers for this deployment, so the HTML policy cannot replace response-header protections such as HSTS or `frame-ancestors`.
