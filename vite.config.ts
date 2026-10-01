import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { JCR_ASSISTANT_SYSTEM_INSTRUCTION } from './src/server/assistantConfig.ts';
import { sendAppointmentEmail } from './src/server/emailService.ts';

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

const sendAppointmentEmailDeclaration: FunctionDeclaration = {
  name: 'sendAppointmentEmail',
  description:
    'Envoie par email la demande de rendez-vous confirmée par le client à Gabqueiros@gmail.com pour le Centre Auto JCR. Ne doit être appelée qu’APRÈS confirmation explicite du client.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      nom: { type: Type.STRING, description: 'Nom complet du client' },
      telephone: { type: Type.STRING, description: 'Numéro de téléphone' },
      plaque: { type: Type.STRING, description: 'Plaque d’immatriculation' },
      vehicule: { type: Type.STRING, description: 'Marque et modèle du véhicule' },
      motif: { type: Type.STRING, description: 'Motif de la demande' },
      description: {
        type: Type.STRING,
        description: 'Description détaillée de la panne, du bruit, du voyant ou de l’entretien',
      },
      disponibilite: {
        type: Type.STRING,
        description: 'Disponibilité souhaitée si indiquée, ou "Non renseignée"',
      },
    },
    required: ['nom', 'telephone', 'plaque', 'vehicule', 'motif', 'description'],
  },
};

function geminiChatPlugin(): Plugin {
  return {
    name: 'gemini-chat-plugin',
    configureServer(server) {
      // POST /api/chat
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
          req.on('end', async () => {
            try {
              const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
              const messages = body.messages || [];

              const apiKey = process.env.GEMINI_API_KEY;
              if (!apiKey) {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'La clé API GEMINI_API_KEY n’est pas configurée.' }));
                return;
              }

              const ai = new GoogleGenAI({
                apiKey,
                httpOptions: {
                  headers: {
                    'User-Agent': 'aistudio-build',
                  },
                },
              });

              // Format conversation history for Gemini
              const contents = messages.map((m: { role: string; content: string }) => ({
                role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
              }));

              const result = await ai.models.generateContent({
                model: 'gemini-3.5-flash',
                contents,
                config: {
                  systemInstruction: JCR_ASSISTANT_SYSTEM_INSTRUCTION,
                  tools: [{ functionDeclarations: [sendAppointmentEmailDeclaration] }],
                },
              });

              let reply = '';
              const functionCalls = result.functionCalls;

              if (functionCalls && functionCalls.length > 0) {
                const call = functionCalls.find((fc) => fc.name === 'sendAppointmentEmail');
                if (call) {
                  const args = (call.args || {}) as any;
                  const emailRes = await sendAppointmentEmail({
                    nom: args.nom || 'Client',
                    telephone: args.telephone || '',
                    plaque: args.plaque || '',
                    vehicule: args.vehicule || 'Véhicule',
                    motif: args.motif || 'Rendez-vous',
                    description: args.description || '',
                    disponibilite: args.disponibilite || 'Non renseignée',
                  });

                  if (emailRes.success) {
                    reply =
                      'Votre demande a bien été transmise au Centre Auto JCR. Le garage pourra vous recontacter au numéro indiqué pour confirmer la prise en charge ou le rendez-vous.';
                  } else {
                    reply =
                      'Je n’ai pas réussi à transmettre votre demande. Vous pouvez contacter directement le Centre Auto JCR au 04 95 33 47 30.';
                  }
                } else {
                  reply = result.text || '';
                }
              } else {
                reply = result.text || '';
              }

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ reply }));
            } catch (err: any) {
              console.error('Chat API error:', err);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(
                JSON.stringify({
                  error: err?.message || 'Une erreur est survenue lors de la communication avec l’assistant.',
                })
              );
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });

      // POST /api/send-appointment (from web form)
      server.middlewares.use('/api/send-appointment', (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
          req.on('end', async () => {
            try {
              const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
              const result = await sendAppointmentEmail({
                nom: body.nom || '',
                telephone: body.telephone || '',
                plaque: body.plaque || '',
                vehicule: body.modele || body.vehicule || 'Non renseigné',
                motif: 'Demande via formulaire du site web',
                description: body.demande || body.description || '',
                disponibilite: body.disponibilite || 'Non renseignée',
              });

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err?.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });

      // POST /api/google-form (direct Google Form submission endpoint)
      server.middlewares.use('/api/google-form', (req, res) => {
        if (req.method === 'POST') {
          const chunks: Buffer[] = [];
          req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
          req.on('end', async () => {
            try {
              const body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
              const { submitToGoogleForms } = await import('./src/server/googleFormsService');
              const result = await submitToGoogleForms({
                nom: body.nom || '',
                telephone: body.telephone || '',
                plaque: body.plaque || '',
                modele: body.modele || '',
                demande: body.demande || '',
              });

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(result));
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ success: false, error: err?.message }));
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

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), videoSavePlugin(), geminiChatPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
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
