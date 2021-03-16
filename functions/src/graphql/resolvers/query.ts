import * as firebaseAdmin from 'firebase-admin';
import { AuthenticationError } from 'apollo-server-express';

const query = {
  /**
   * Fetch user profile
   * @param _
   * @param args
   * @param context
   * @returns
   */
  profile: async (
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
  posts: async (
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
  post: async (
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
