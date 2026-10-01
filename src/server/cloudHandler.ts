import { JCR_ASSISTANT_SYSTEM_INSTRUCTION } from './assistantConfig.ts';
import { GOOGLE_FORMS_URL, GoogleFormData } from './googleFormsService.ts';

export const TEST_RECIPIENT_EMAIL = 'Gabqueiros@gmail.com';

const SEND_APPOINTMENT_DECLARATION = {
  name: 'sendAppointmentEmail',
  description:
    'Envoie par email la demande de rendez-vous confirmée par le client à Gabqueiros@gmail.com pour le Centre Auto JCR. Ne doit être appelée qu’APRÈS confirmation explicite du client.',
  parameters: {
    type: 'OBJECT',
    properties: {
      nom: { type: 'STRING', description: 'Nom complet du client' },
      telephone: { type: 'STRING', description: 'Numéro de téléphone' },
      plaque: { type: 'STRING', description: 'Plaque d’immatriculation' },
      vehicule: { type: 'STRING', description: 'Marque et modèle du véhicule' },
      motif: { type: 'STRING', description: 'Motif de la demande' },
      description: {
        type: 'STRING',
        description: 'Description détaillée de la panne, du bruit, du voyant ou de l’entretien',
      },
      disponibilite: {
        type: 'STRING',
        description: 'Disponibilité souhaitée si indiquée, ou "Non renseignée"',
      },
    },
    required: ['nom', 'telephone', 'plaque', 'vehicule', 'motif', 'description'],
  },
};

/**
 * Submits form data to Google Forms using pure fetch (Edge / Cloudflare compatible).
 */
export async function submitGoogleForms(data: GoogleFormData): Promise<{ success: boolean; status?: number; error?: string }> {
  try {
    const params = new URLSearchParams();
    params.append('entry.2109371838', data.nom || '');
    params.append('entry.423141695', data.telephone || '');
    params.append('entry.1433261437', data.plaque || '');
    params.append('entry.11018427', data.modele || '');
    params.append('entry.1943917514', data.demande || '');

    const res = await fetch(GOOGLE_FORMS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    return { success: res.ok || res.status === 200, status: res.status };
  } catch (err: any) {
    console.error('[Google Forms] Error posting:', err);
    return { success: false, error: err?.message };
  }
}

/**
 * Optional email dispatch via Resend API (Edge / Cloudflare compatible).
 */
export async function sendEmailNotification(
  subject: string,
  body: string,
  resendApiKey?: string
): Promise<{ success: boolean }> {
  if (!resendApiKey) {
    return { success: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: 'Centre Auto JCR <contact@centreautojcr.fr>',
        to: [TEST_RECIPIENT_EMAIL],
        subject,
        text: body,
      }),
    });
    return { success: res.ok };
  } catch (err) {
    console.error('[Resend Email] Error:', err);
    return { success: false };
  }
}

/**
 * Common CORS headers
 */
const CORS_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

/**
 * Handles /api/chat with Gemini API (Edge & Cloudflare compatible).
 */
export async function handleChat(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  try {
    const body = await request.json() as any;
    const messages = body.messages || [];

    // Safely retrieve GEMINI_API_KEY from Cloudflare env or process.env
    const apiKey =
      env?.GEMINI_API_KEY ||
      (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined);

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            'La variable GEMINI_API_KEY n’est pas configurée dans Cloudflare Workers. Veuillez l’ajouter dans les Variables d’environnement Cloudflare.',
        }),
        { status: 500, headers: CORS_HEADERS }
      );
    }

    // Format conversation messages for Gemini REST API
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Build payload according to Gemini standard
    const payload = {
      systemInstruction: {
        parts: [{ text: JCR_ASSISTANT_SYSTEM_INSTRUCTION }],
      },
      contents,
      tools: [
        {
          functionDeclarations: [SEND_APPOINTMENT_DECLARATION],
        },
      ],
    };

    // Attempt model call with automatic fallback
    const modelsToTry = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let geminiRes: Response | null = null;
    let geminiData: any = null;

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'aistudio-build',
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          geminiRes = res;
          geminiData = await res.json();
          break;
        } else {
          const errText = await res.text();
          console.warn(`[Gemini ${model}] failed with status ${res.status}:`, errText);
          // If 503 or 429, try next model
          if (res.status === 503 || res.status === 429 || res.status === 404) {
            continue;
          } else {
            // Bad request or invalid key, return error
            return new Response(
              JSON.stringify({ error: `Erreur Gemini (${res.status}): ${errText}` }),
              { status: res.status, headers: CORS_HEADERS }
            );
          }
        }
      } catch (err: any) {
        console.warn(`[Gemini ${model}] network error:`, err?.message);
      }
    }

    if (!geminiData) {
      return new Response(
        JSON.stringify({
          error: 'Le service Gemini est temporairement indisponible. Veuillez réessayer.',
        }),
        { status: 503, headers: CORS_HEADERS }
      );
    }

    const candidate = geminiData.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    let reply = '';

    // Check if Gemini invoked sendAppointmentEmail tool
    const functionCallPart = parts.find((p: any) => p.functionCall && p.functionCall.name === 'sendAppointmentEmail');

    if (functionCallPart) {
      const args = functionCallPart.functionCall.args || {};
      const nom = args.nom || 'Client';
      const telephone = args.telephone || '';
      const plaque = args.plaque || '';
      const vehicule = args.vehicule || 'Véhicule';
      const motif = args.motif || 'Rendez-vous';
      const description = args.description || '';
      const disponibilite = args.disponibilite || 'Non renseignée';

      // Submit to Google Forms
      await submitGoogleForms({
        nom,
        telephone,
        plaque,
        modele: vehicule,
        demande: `${motif} — ${description} (Disponibilité: ${disponibilite})`,
      });

      // Send email via Resend if RESEND_API_KEY is present
      const resendApiKey =
        env?.RESEND_API_KEY ||
        (typeof process !== 'undefined' ? process.env?.RESEND_API_KEY : undefined);

      const emailSubject = `Nouvelle demande de rendez-vous — Centre Auto JCR — ${nom}`;
      const emailBody = `Nouvelle demande reçue depuis le chatbot du site Centre Auto JCR.\n\nNom: ${nom}\nTéléphone: ${telephone}\nPlaque: ${plaque}\nVéhicule: ${vehicule}\nMotif: ${motif}\nDescription: ${description}\nDisponibilité: ${disponibilite}`;

      await sendEmailNotification(emailSubject, emailBody, resendApiKey);

      reply =
        'Votre demande a bien été transmise au Centre Auto JCR. Le garage pourra vous recontacter au numéro indiqué pour confirmer la prise en charge ou le rendez-vous.';
    } else {
      const textParts = parts.filter((p: any) => p.text).map((p: any) => p.text);
      reply = textParts.join('\n\n') || 'Bonjour, que puis-je faire pour vous ?';
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    console.error('[Chat API Error]:', err);
    return new Response(
      JSON.stringify({
        error: err?.message || 'Une erreur inattendue est survenue.',
      }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * Handles /api/send-appointment (from the website form).
 */
export async function handleSendAppointment(request: Request, env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  try {
    const body = await request.json() as any;
    const nom = body.nom || '';
    const telephone = body.telephone || '';
    const plaque = body.plaque || '';
    const modele = body.modele || body.vehicule || 'Non renseigné';
    const demande = body.demande || body.description || '';
    const disponibilite = body.disponibilite || 'Non renseignée';

    // 1. Submit directly to Google Forms
    const googleFormResult = await submitGoogleForms({
      nom,
      telephone,
      plaque,
      modele,
      demande: disponibilite && disponibilite !== 'Non renseignée' ? `${demande} (Disponibilité: ${disponibilite})` : demande,
    });

    // 2. Send email via Resend if RESEND_API_KEY is configured
    const resendApiKey =
      env?.RESEND_API_KEY ||
      (typeof process !== 'undefined' ? process.env?.RESEND_API_KEY : undefined);

    const emailSubject = `Nouvelle demande formulaire site — Centre Auto JCR — ${nom}`;
    const emailBody = `Nouvelle demande reçue depuis le formulaire du site web Centre Auto JCR.\n\nNom: ${nom}\nTéléphone: ${telephone}\nPlaque: ${plaque}\nModèle: ${modele}\nDemande: ${demande}\nDisponibilité: ${disponibilite}`;

    await sendEmailNotification(emailSubject, emailBody, resendApiKey);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Demande enregistrée avec succès.',
        googleForms: googleFormResult.success,
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err: any) {
    console.error('[Send Appointment Error]:', err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message || 'Erreur d’enregistrement' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

/**
 * Handles /api/google-form direct proxy.
 */
export async function handleGoogleForm(request: Request, _env: any): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: CORS_HEADERS,
    });
  }

  try {
    const body = await request.json() as any;
    const result = await submitGoogleForms({
      nom: body.nom || '',
      telephone: body.telephone || '',
      plaque: body.plaque || '',
      modele: body.modele || '',
      demande: body.demande || '',
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err?.message }),
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
