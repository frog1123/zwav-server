import { ObjectId } from 'mongodb';
import { db } from '../index';

export const post = {
  Query: {
    post: async (_: any, { id }: { id: string }) => {
      const { author, title, content, createdAt } = await db.collection('posts').findOne({ _id: new ObjectId(id) });

      return {
        author: author,
        title: title,
        content: content,
        createdAt: createdAt
      };
    },
    posts: async () => {
      const posts = await db.collection('posts').find({}).sort({ $natural: -1 }).toArray();
      return posts;
    }
  },
  Mutation: {
    createPost: async (_: any, { author, title, content, createdAt }: { author: string; title: string; content: string; createdAt: string }) => {
      const post = await db.collection('posts').insertOne({
        author: author,
        title: title,
        content: content,
        createdAt: createdAt
      });

      return await db.collection('posts').findOne({ _id: post.insertedId });
    }
  }
};
