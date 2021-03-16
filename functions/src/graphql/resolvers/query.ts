import * as firebaseAdmin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { AuthenticationError } from 'apollo-server-express';
import firebase from 'firebase';

const CONFIG = functions.config().env;
const FIREBASE_CONFIG = CONFIG.firebase;

firebase.initializeApp(FIREBASE_CONFIG);

const query = {
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
   * Fetch user profile
   * @param _
   * @param args
   * @param context
   * @returns
   */
  getProfile: async (
    _: any,
    args: any,
    context: { decodedToken?: firebaseAdmin.auth.DecodedIdToken }
  ) => {
    const { decodedToken } = context;

    if (!decodedToken) throw new AuthenticationError('You are not logged in');

    const user = await firebaseAdmin.auth().getUser(decodedToken.uid);

    return user.toJSON();
  },

  /**
   * Get all user blog posts
   * @param _
   * @param args
   * @param context
   * @returns
   */
  getPosts: async (
    _: any,
    args: any,
    context: { decodedToken?: firebaseAdmin.auth.DecodedIdToken }
  ) => {
    const { decodedToken } = context;

    if (!decodedToken) throw new AuthenticationError('You are not logged in');

    const posts = await firebaseAdmin
      .firestore()
      .collection('posts')
      .where('user_id', '==', decodedToken.uid)
      .get();

    return posts.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  /**
   * Get single blog post
   * @param _
   * @param args
   * @param context
   * @returns
   */
  getPost: async (
    _: any,
    args: { id: string },
    context: { decodedToken?: firebaseAdmin.auth.DecodedIdToken }
  ) => {
    const { decodedToken } = context;

    if (!decodedToken) throw new AuthenticationError('You are not logged in');

    const { id } = args;

    const post = await firebaseAdmin
      .firestore()
      .collection('posts')
      .doc(id)
      .get();

    return post.data();
  }
};

export default query;
