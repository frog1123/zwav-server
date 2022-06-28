import { ObjectId } from 'mongodb';
import { db } from '../index';

export const post = {
  Query: {
    post: async (_: any, { id }: { id: string }) => {
      const { author, title, content } = await db.collection('posts').findOne({ _id: new ObjectId(id) });

      return {
        author: author,
        title: title,
        content: content
      };
    },
    posts: async () => {
      const posts = await db.collection('posts').find({}).toArray();
      return posts;
    }
  },
  Mutation: {
    createPost: async (_: any, { author, title, content }: { author: string; title: string; content: string }) => {
      const post = await db.collection('posts').insertOne({
        author: author,
        title: title,
        content: content
      });

      return await db.collection('posts').findOne({ _id: post.insertedId });
    }
  }
};
