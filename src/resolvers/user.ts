import { db } from '../index';
import { validate } from 'email-validator';
import { ObjectId } from 'mongodb';
import { genSalt, hash, compare } from 'bcrypt';

export const user = {
  Query: {
    login: async (_: any, { email, password }: { email: string; password: string }) => {
      if (email.length === 0 || password.length === 0) return { response: 'failure' };

      const user = await db.collection('users').findOne({ email });
      if (!user) return { response: 'user_does_not_exist' };

      if ((await compare(password, user.password)) === false) return { response: 'wrong_password' };

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
      if (username.length > 29) return;
      if (username.length === 0 || email.length === 0 || password.length < 8) return 'failure';

      if (validate(email) === false) return 'email_invalid';

      const user = await db.collection('users').findOne({ email });
      if (user !== null) return 'email_already_used';

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      await db.collection('users').insertOne({
        username,
        email,
        password: hashedPassword,
        createdAt
      });

      return 'success';
    }
  }
};
