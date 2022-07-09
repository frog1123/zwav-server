import { db } from '../index';
import { validate } from 'email-validator';
import { ObjectId } from 'mongodb';

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
    },
    user: async (_: any, { id }: { id: string }) => {
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });

      return {
        id: id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      };
    }
  },
  Mutation: {
    registerUser: async (_: any, { username, email, password, createdAt }: { username: string; email: string; password: string; createdAt: string }) => {
      if (username.length === 0 || email.length === 0 || password.length < 8) return 'failure';

      if (validate(email) === false) return 'email_invalid';

      const user = await db.collection('users').findOne({ email });
      if (user !== null) return 'email_already_used';

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
