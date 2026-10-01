import { handleChat } from '../../src/server/cloudHandler.ts';

export const onRequest = async (context: any) => {
  return handleChat(context.request, context.env);
};
