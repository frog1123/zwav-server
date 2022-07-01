import { ObjectId } from 'mongodb';
import { db } from '../index';

export const post = {
  Query: {
    post: async (_: any, { id }: { id: string }) => {
      const { _id, author, title, content, createdAt } = await db.collection('posts').findOne({ _id: new ObjectId(id) });

      return {
        id: _id,
        author: author,
        title: title,
        content: content,
        createdAt: createdAt
      };
    },
    posts: async () => {
      const posts = await db.collection('posts').find({}).limit(30).sort({ $natural: -1 }).toArray();

      const postsWithIDs = posts.map((obj: any, index: number) => ({ ...obj, id: posts[index]._id }));
      return postsWithIDs;
    }
  },
  Mutation: {
    createPost: async (_: any, { author, title, content, createdAt }: { author: string; title: string; content: string; createdAt: string }) => {
      if (title.length === 0) return;

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
