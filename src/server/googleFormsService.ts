export const GOOGLE_FORMS_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSefx76OqI5PYvekwHwdgRb-0o7kRK_lB2ULQt-S7ePXN2Kh5w/formResponse';

export interface GoogleFormData {
  nom: string;
  telephone: string;
  plaque: string;
  modele?: string;
  demande: string;
}

/**
 * Submits form data to the official Google Form specified by the user.
 * 
 * Field mapping:
 * - NOM = entry.2109371838
 * - Numéro de téléphone = entry.423141695
 * - Plaque d’immatriculation = entry.1433261437
 * - Modèle du véhicule (optionnel) = entry.11018427
 * - Raison de la panne ou de la demande = entry.1943917514
 */
export async function submitToGoogleForms(
  data: GoogleFormData
): Promise<{ success: boolean; status?: number; error?: string }> {
  try {
    const params = new URLSearchParams();
    params.append('entry.2109371838', data.nom || '');
    params.append('entry.423141695', data.telephone || '');
    params.append('entry.1433261437', data.plaque || '');
    params.append('entry.11018427', data.modele || '');
    params.append('entry.1943917514', data.demande || '');

    console.log('[GOOGLE FORMS] Sending POST request to Google Forms...');
    const response = await fetch(GOOGLE_FORMS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    console.log(`[GOOGLE FORMS] Response status: ${response.status} ${response.statusText}`);
    return { success: response.ok || response.status === 200, status: response.status };
  } catch (err: any) {
    console.error('[GOOGLE FORMS] Error posting to Google Forms:', err);
    return { success: false, error: err?.message || 'Error submitting to Google Forms' };
  }
}
