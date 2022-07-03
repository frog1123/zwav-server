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
        comments
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
        author,
        title,
        content,
        createdAt,
        comments: []
      });

      return 'success';
    },
    createComment: async (_: any, { postId, author, content, createdAt }: { postId: string; author: string; content: string; createdAt: string }) => {
      if (content.length === 0) return;

      const commentId = new ObjectId();

      await db.collection('posts').updateOne(
        { _id: new ObjectId(postId) },
        {
          $push: {
            comments: {
              _id: commentId,
              author,
              content,
              createdAt
            }
          }
        },
        { upsert: true }
      );

      return 'success';
    }
  }
};
