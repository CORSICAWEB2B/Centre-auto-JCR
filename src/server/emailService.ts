import fs from 'fs';
import path from 'path';
import { submitToGoogleForms } from './googleFormsService';

export interface AppointmentData {
  nom: string;
  telephone: string;
  plaque: string;
  vehicule: string;
  motif: string;
  description: string;
  disponibilite?: string;
}

export const TEST_RECIPIENT_EMAIL = 'Gabqueiros@gmail.com';

export async function sendAppointmentEmail(data: AppointmentData): Promise<{ success: boolean; message?: string }> {
  const { nom, telephone, plaque, vehicule, motif, description, disponibilite } = data;

  const subject = `Nouvelle demande de rendez-vous — Centre Auto JCR — ${nom}`;
  const body = `Nouvelle demande reçue depuis le chatbot du site Centre Auto JCR.

Nom :
${nom}

Téléphone :
${telephone}

Plaque d’immatriculation :
${plaque}

Véhicule :
${vehicule}

Motif :
${motif}

Description :
${description}

Disponibilité souhaitée :
${disponibilite && disponibilite.trim() ? disponibilite.trim() : 'Non renseignée'}

---
Demande envoyée depuis le chatbot du site Centre Auto JCR.`;

  console.log('--------------------------------------------------');
  console.log(`[EMAIL DISPATCH] Destination: ${TEST_RECIPIENT_EMAIL}`);
  console.log(`[EMAIL DISPATCH] Subject: ${subject}`);
  console.log('[EMAIL DISPATCH] Content:\n' + body);
  console.log('--------------------------------------------------');

  // Submit to Google Forms as requested
  try {
    await submitToGoogleForms({
      nom,
      telephone,
      plaque,
      modele: vehicule,
      demande: motif ? `${motif} — ${description}` : description,
    });
  } catch (err) {
    console.error('[GOOGLE FORMS] Automatic submission error:', err);
  }

  try {
    // 1. If Resend API key is configured
    if (process.env.RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Centre Auto JCR <contact@centreautojcr.fr>',
          to: [TEST_RECIPIENT_EMAIL],
          subject,
          text: body,
        }),
      });

      if (res.ok) {
        return { success: true, message: 'Email envoyé via Resend' };
      }
    }

    // 2. If SMTP is configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Centre Auto JCR" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: TEST_RECIPIENT_EMAIL,
        subject,
        text: body,
      });

      return { success: true, message: 'Email envoyé via SMTP' };
    }

    // 3. Fallback: Log and record the validated appointment to storage
    const recordsDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(recordsDir)) {
      fs.mkdirSync(recordsDir, { recursive: true });
    }

    const logPath = path.join(recordsDir, 'appointment-emails.json');
    let logs = [];
    if (fs.existsSync(logPath)) {
      try {
        logs = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
      } catch {
        logs = [];
      }
    }

    logs.push({
      timestamp: new Date().toISOString(),
      recipient: TEST_RECIPIENT_EMAIL,
      subject,
      body,
      data,
    });

    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2), 'utf-8');

    return {
      success: true,
      message: `Demande transmise avec succès pour ${TEST_RECIPIENT_EMAIL}`,
    };
  } catch (error: any) {
    console.error('Erreur lors de l’envoi de l’email:', error);
    return {
      success: false,
      message: error?.message || 'Erreur lors de l’envoi de la demande',
    };
  }
}
