import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import dotenv from 'dotenv';
dotenv.config();

const devOTPStore = new Map<string, { target: string; code: string; expiresAt: number; attempts: number }>();

function apiServerPlugin(): Plugin {
  return {
    name: 'api-server-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/chat' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const { handleApiChat } = await import('./server/apiHandler');
              const parsed = JSON.parse(body || '{}');
              const response = await handleApiChat(parsed);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(response));
            } catch (err: any) {
              console.error('Vite API Middleware Chat Error:', err);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message || 'Chat generation failed' }));
            }
          });
          return;
        }

        if (req.url === '/api/auth/otp-request' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { target } = JSON.parse(body || '{}');
              if (!target) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'Target email/phone is required' }));
              }
              const cleanTarget = target.trim().toLowerCase();
              const otp = Math.floor(100000 + Math.random() * 900000).toString();
              const expiresAt = Date.now() + 5 * 60 * 1000;
              devOTPStore.set(cleanTarget, { target: cleanTarget, code: otp, expiresAt, attempts: 0 });
              
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: 'Verification code generated.',
                simulatedOTP: otp,
                expiresIn: 300,
                mode: 'preview_simulation'
              }));
            } catch (e: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }

        if (req.url === '/api/auth/otp-verify' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            try {
              const { target, code } = JSON.parse(body || '{}');
              const cleanTarget = (target || '').trim().toLowerCase();
              const record = devOTPStore.get(cleanTarget);
              if (!record || Date.now() > record.expiresAt || record.code !== (code || '').trim()) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'Invalid or expired OTP code.' }));
              }
              devOTPStore.delete(cleanTarget);
              const isAdmin = cleanTarget === 'skyadav02837@gmail.com';
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                user: {
                  id: `user-${Date.now()}`,
                  email: cleanTarget,
                  role: isAdmin ? 'admin' : 'client',
                  isEmailVerified: true
                }
              }));
            } catch (e: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: e.message }));
            }
          });
          return;
        }

        if (req.url === '/api/contact' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: 'Message recorded successfully' }));
          });
          return;
        }

        if (req.url === '/api/health' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
