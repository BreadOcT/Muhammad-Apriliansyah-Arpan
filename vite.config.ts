import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

// Custom plugin to serve and copy the /files directory without parsing or compression
function serveFilesPlugin() {
  return {
    name: 'serve-files-plugin',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url && req.url.startsWith('/files/')) {
          const decodedUrl = decodeURIComponent(req.url);
          const cleanUrl = decodedUrl.split('?')[0].split('#')[0];
          const filePath = path.join(process.cwd(), cleanUrl);
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = path.extname(filePath).toLowerCase();
            let contentType = 'application/octet-stream';
            if (ext === '.pdf') contentType = 'application/pdf';
            else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
            else if (ext === '.png') contentType = 'image/png';
            
            try {
              const fileBuffer = fs.readFileSync(filePath);
              res.setHeader('Content-Type', contentType);
              res.setHeader('Content-Length', fileBuffer.length);
              res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
              res.end(fileBuffer);
              return;
            } catch (err) {
              console.error('Error reading file in serveFilesPlugin:', err);
            }
          }
        }
        next();
      });
    },
    closeBundle() {
      const srcDir = path.resolve(process.cwd(), 'files');
      const destDir = path.resolve(process.cwd(), 'dist/files');
      if (fs.existsSync(srcDir)) {
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
        const files = fs.readdirSync(srcDir);
        for (const file of files) {
          const srcFile = path.join(srcDir, file);
          const destFile = path.join(destDir, file);
          fs.copyFileSync(srcFile, destFile);
        }
        console.log('Successfully copied all files from /files to /dist/files');
      }
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), serveFilesPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
