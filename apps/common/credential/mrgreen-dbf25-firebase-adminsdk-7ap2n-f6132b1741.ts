import { ServiceAccount } from 'firebase-admin/app';

export const credential: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECTID,
  privateKey: process.env.FIREBASE_PRIVATEKEY.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENTEMAIL,
};
