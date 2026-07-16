import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Injects the Content-Security-Policy meta tag into the built index.html only.
// Vite's dev server injects CSS as inline <style> tags (HMR), which a strict
// style-src would block, so local `npm run dev` intentionally runs without it.
function cspMetaTagPlugin(apiUrl) {
  const csp = [
    "default-src 'self'",
    "script-src 'self' https://accounts.google.com/gsi/client",
    "style-src 'self' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    `img-src 'self' data: ${apiUrl} https://lh3.googleusercontent.com`,
    `connect-src 'self' ${apiUrl} https://accounts.google.com`,
    "frame-src https://accounts.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')

  return {
    name: 'csp-meta-tag',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace(
        '</head>',
        `    <meta http-equiv="Content-Security-Policy" content="${csp};" />\n  </head>`,
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:3000'

  return {
    plugins: [react(), tailwindcss(), cspMetaTagPlugin(apiUrl)],
    server: {
      port: 5173,
      proxy: {
        '/auth': 'http://localhost:3000',
        // trailing slash so this doesn't prefix-match the frontend's own
        // /users route (which starts with "/user" too)
        '/user/': 'http://localhost:3000',
        '/messages': 'http://localhost:3000',
        '/uploads': 'http://localhost:3000',
      },
    },
  }
})
