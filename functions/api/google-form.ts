import { handleGoogleForm } from '../../src/server/cloudHandler.ts';

export const onRequest = async (context: any) => {
  return handleGoogleForm(context.request, context.env);
};
