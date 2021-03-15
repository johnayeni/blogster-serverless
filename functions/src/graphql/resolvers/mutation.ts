import * as firebaseAdmin from 'firebase-admin';
import * as functions from 'firebase-functions';
import firebase from 'firebase';
import { AuthenticationError } from 'apollo-server-express';

const CONFIG = functions.config().env;
const FIREBASE_CONFIG = CONFIG.firebase;

firebase.initializeApp(FIREBASE_CONFIG);

const mutation = {
  /**
   * Login and authenticate a user
   * @param _
   * @param args
   * @returns
   */
  login: async (_: any, args: { email: string; password: string }) => {
    const { email, password } = args;

    try {
      const credential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);

      const user = await credential.user?.toJSON();
      const token = await credential.user?.getIdToken();

      return {
        user,
        token
      };
    } catch (error) {
      throw new AuthenticationError('Invalid username or password');
    }
  },

  /**
   * Create a new user
   * @param _
   * @param args
   * @returns
   */
  register: async (
    _: any,
    args: { displayName: string; email: string; password: string }
  ) => {
    const { displayName, email, password } = args;

    await firebaseAdmin.auth().createUser({
      displayName,
      email,
      password
    });

    return { message: 'Account created successfully' };
  },

  /**
   * Create a new post
   * @param _
   * @param args
   * @param context
   * @returns
   */
  createPost: async (
    _: any,
    args: { title: string; body: string },
    context: { decodedToken: firebaseAdmin.auth.DecodedIdToken }
  ) => {
    const { decodedToken } = context;
    const { title, body } = args;

    const data = await firebaseAdmin.firestore().collection('posts').add({
      title,
      body,
      user_id: decodedToken.uid,
      timestamp: firebaseAdmin.firestore.FieldValue.serverTimestamp()
    });

    const post = await data.get();

    return post.data();
  }
};

export default mutation;
