import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';

function permanentPortraitPlugin(): Plugin {
  return {
    name: 'permanent-portrait-plugin',
    configureServer(server) {
      server.middlewares.use('/api/upload-permanent-portrait', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { dataUrl } = JSON.parse(body);
              if (dataUrl && dataUrl.startsWith('data:image/')) {
                const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                fs.writeFileSync(path.resolve('public/astrologer_portrait.jpg'), buffer);
                fs.writeFileSync(path.resolve('public/astrologer_portrait.png'), buffer);
                fs.writeFileSync(path.resolve('public/Screenshot 2026-10-14 at 10.39.17 PM.png'), buffer);
                if (fs.existsSync('dist')) {
                  fs.writeFileSync(path.resolve('dist/astrologer_portrait.jpg'), buffer);
                  fs.writeFileSync(path.resolve('dist/astrologer_portrait.png'), buffer);
                  fs.writeFileSync(path.resolve('dist/Screenshot 2026-10-14 at 10.39.17 PM.png'), buffer);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
                return;
              }
            } catch (err) {
              console.error('Error saving portrait:', err);
            }
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid data' }));
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [react(), tailwindcss(), permanentPortraitPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

