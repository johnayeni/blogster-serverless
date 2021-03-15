import * as firebaseAdmin from 'firebase-admin';
import { ExpressContext } from 'apollo-server-express';

const auth = async ({ req }: ExpressContext) => {
  const token = req.headers.authorization || '';

  let decodedToken: any;

  if (token) decodedToken = await firebaseAdmin.auth().verifyIdToken(token);

  return {
    decodedToken
  };
};

export default auth;
