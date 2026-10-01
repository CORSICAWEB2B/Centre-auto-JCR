import { handleSendAppointment } from '../../src/server/cloudHandler.ts';

export const onRequest = async (context: any) => {
  return handleSendAppointment(context.request, context.env);
};
