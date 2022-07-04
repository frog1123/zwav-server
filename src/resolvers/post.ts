import { ObjectId } from 'mongodb';
import { db } from '../index';

export const post = {
  Query: {
    post: async (_: any, { id }: { id: string }) => {
      const { author, title, content, comments, createdAt } = await db.collection('posts').findOne({ _id: new ObjectId(id) });

      return {
        id,
        author,
        title,
        content,
        createdAt,
        comments: await db
          .collection('comments')
          .find({ replyingTo: new ObjectId(id) })
          .toArray()
      };
    },
    posts: async (_: any, { limit, offset }: { limit: number; offset: number }) => {
      const posts = await db.collection('posts').find({}).skip(offset).limit(limit).sort({ createdAt: -1 }).toArray();

      const postsWithIDs = posts.map((obj: any, index: number) => ({ ...obj, id: posts[index]._id }));
      return postsWithIDs;
    }
  },

  Mutation: {
    createPost: async (_: any, { author, title, content, createdAt }: { author: string; title: string; content: string; createdAt: string }) => {
      if (title.length === 0) return;

      await db.collection('posts').insertOne({
        author,
        title,
        content,
        createdAt
      });

      return 'success';
    }
  }
};
