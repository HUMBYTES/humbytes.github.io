import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const productionSecurityPolicy = {
  name: 'production-security-policy',
  apply: 'build',
  transformIndexHtml(html) {
    const policy = [
      "default-src 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "frame-src 'none'",
      "form-action 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self'",
      "font-src 'self'",
      "connect-src 'self'",
      'upgrade-insecure-requests',
    ].join('; ')

    return html.replace(
      '<head>',
      `<head>\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`,
    )
  },
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), productionSecurityPolicy],
})
