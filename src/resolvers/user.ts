import { db } from '../index';

export const user = {
  Query: {
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      if (email.length === 0 || password.length === 0) return { response: 'failure' };

      const user = await db.collection('users').findOne({ email });
      if (!user) return { response: 'user_does_not_exist' };
      if (user.password !== password) return { response: 'wrong_password' };

      return {
        id: user._id,
        response: 'success'
      };
    }
  },
  Mutation: {
    registerUser: async (_: any, { username, email, password, createdAt }: { username: string; email: string; password: string; createdAt: string }) => {
      if (username.length === 0 || email.length === 0 || password.length < 8) return 'failure';

      await db.collection('users').insertOne({
        username,
        email,
        password,
        createdAt
      });

      return 'success';
    }
  }
};
