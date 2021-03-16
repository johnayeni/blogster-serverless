import * as firebaseAdmin from 'firebase-admin';

const mutation = {
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
