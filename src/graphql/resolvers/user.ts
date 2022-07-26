import { db } from '../../index';
import { validate } from 'email-validator';
import { ObjectId } from 'mongodb';
import { hash, compare } from 'bcrypt';

export const user = {
  Query: {
    user: async (_: any, { id }: { id: string }) => {
      const { _id, username, pfpLink, bannerColor, createdAt } = await db.collection('users').findOne({ _id: new ObjectId(id) });

      return {
        id: _id,
        username,
        pfpLink,
        bannerColor,
        createdAt
      };
    },
    login: async (_: any, { email, password }: { email: string; password: string }, { req }: any) => {
      if (email.length === 0 || password.length === 0) return { response: 'failure' };

      const user = await db.collection('users').findOne({ email });
      if (!user) return { response: 'user_does_not_exist' };

      if (!(await compare(password, user.password))) return { response: 'wrong_password' };

      const hashedId = await hash(user._id.toString(), 5);
      req.session.user_id = hashedId;

      return {
        id: user._id,
        response: 'success'
      };
    },
    logout: (_: any, __: any, { req, res }: any) => {
      res.clearCookie('connect.sid');
      res.clearCookie('currentUserId');
      req.session.destroy();
      return 'success';
    },
    refreshUser: (_: any, __: any, { req }: any) => {
      req.session.touch();
      return 'success';
    }
  },
  Mutation: {
    registerUser: async (_: any, { username, email, password, createdAt }: { username: string; email: string; password: string; createdAt: string }) => {
      if (username.length > 29) return;
      if (username.length === 0 || email.length === 0 || password.length < 8) return 'failure';

      if (validate(email) === false) return 'email_invalid';

      const user = await db.collection('users').findOne({ email });
      if (user !== null) return 'email_already_used';

      const hashedPassword = await hash(password, 10);

      const colors = ['#cdb4db', '#ffc8dd', '#bde0fe', '#a2d2ff', '#2a9d8f', '#f77f00', '#00f5d4', '#588157', '#b5179e', '#52796f', '#98f5e1', '#212529'];

      await db.collection('users').insertOne({
        username,
        email,
        password: hashedPassword,
        pfpLink: 'https://brandeps.com/icon-download/A/Account-circle-icon-vector-01.svg',
        bannerColor: colors[Math.floor(Math.random() * colors.length)],
        createdAt
      });

      return 'success';
    }
  }
};
