import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import { handleChat, handleSendAppointment, handleGoogleForm } from './src/server/cloudHandler.ts';

function videoSavePlugin(): Plugin {
  return {
    name: 'video-save-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-hero-video', (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
          req.on('end', () => {
            try {
              const buffer = Buffer.concat(chunks);
              const publicDir = path.resolve(process.cwd(), 'public');
              if (!fs.existsSync(publicDir)) {
                fs.mkdirSync(publicDir, { recursive: true });
              }
              const targetPath = path.resolve(publicDir, 'hero-video.mp4');
              fs.writeFileSync(targetPath, buffer);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, size: buffer.length }));
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err?.message || 'Failed to save video' }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    },
  };
}

/**
 * Builds Cloudflare Pages & Workers _worker.js bundle automatically on build.
 */
function cloudflareWorkerBuildPlugin(): Plugin {
  return {
    name: 'cloudflare-worker-build-plugin',
    closeBundle: async () => {
      try {
        const esbuild = await import('esbuild');
        await esbuild.build({
          entryPoints: [path.resolve(process.cwd(), 'src/worker.ts')],
          outfile: path.resolve(process.cwd(), 'dist/_worker.js'),
          bundle: true,
          format: 'esm',
          platform: 'browser',
          target: 'es2022',
          minify: true,
        });
        console.log('✓ Cloudflare dist/_worker.js built successfully');
      } catch (err) {
        console.error('Failed to bundle dist/_worker.js:', err);
      }
    },
  };
}

/**
 * Local development middleware proxying requests through the universal cloudHandler.
 */
function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-plugin',
    configureServer(server) {
      const adaptNodeRequest = async (req: any, routeHandler: (request: Request, env: any) => Promise<Response>, res: any) => {
        try {
          const chunks: Buffer[] = [];
          for await (const chunk of req) {
            chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
          }
          const body = Buffer.concat(chunks).toString('utf-8');
          const fullUrl = `http://${req.headers.host || 'localhost'}${req.url}`;

          const webReq = new Request(fullUrl, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: req.method !== 'GET' && req.method !== 'HEAD' ? body : undefined,
          });

          const webRes = await routeHandler(webReq, process.env);
          res.statusCode = webRes.status;
          webRes.headers.forEach((val, key) => {
            res.setHeader(key, val);
          });
          const resBody = await webRes.text();
          res.end(resBody);
        } catch (err: any) {
          console.error('Dev API Error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err?.message || 'Server Error' }));
        }
      };

      // POST /api/chat
      server.middlewares.use('/api/chat', (req, res) => {
        adaptNodeRequest(req, handleChat, res);
      });

      // POST /api/send-appointment
      server.middlewares.use('/api/send-appointment', (req, res) => {
        adaptNodeRequest(req, handleSendAppointment, res);
      });

      // POST /api/google-form
      server.middlewares.use('/api/google-form', (req, res) => {
        adaptNodeRequest(req, handleGoogleForm, res);
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      videoSavePlugin(),
      devApiPlugin(),
      cloudflareWorkerBuildPlugin(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), '.'),
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
