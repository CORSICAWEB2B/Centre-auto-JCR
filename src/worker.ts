/**
 * Cloudflare Worker Entry Point for Centre Auto JCR
 * Handles /api/chat, /api/send-appointment, /api/google-form
 * and delegates all other requests to static assets (env.ASSETS).
 */
import { handleChat, handleSendAppointment, handleGoogleForm } from './server/cloudHandler.ts';

export interface Env {
  GEMINI_API_KEY?: string;
  RESEND_API_KEY?: string;
  ASSETS?: {
    fetch: (request: Request) => Promise<Response>;
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // API Routes
    if (url.pathname === '/api/chat') {
      return handleChat(request, env);
    }

    if (url.pathname === '/api/send-appointment') {
      return handleSendAppointment(request, env);
    }

    if (url.pathname === '/api/google-form') {
      return handleGoogleForm(request, env);
    }

    // Static Assets fallback for Cloudflare Workers Assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },
};
