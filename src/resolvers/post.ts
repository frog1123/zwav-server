import { ObjectId } from 'mongodb';
import { db } from '../index';

export const post = {
  Query: {
    post: async (_: any, { id, commentsLimit, commentsOffset }: { id: string; commentsLimit: number; commentsOffset: number }) => {
      const { author, title, content, createdAt } = await db.collection('posts').findOne({ _id: new ObjectId(id) });

      const comments = await db
        .collection('comments')
        .find({ replyingTo: new ObjectId(id) })
        .skip(commentsOffset)
        .limit(commentsLimit)
        .sort({ createdAt: -1 })
        .toArray();

      const commentsWithIDS = comments.map((obj: any, index: number) => ({ ...obj, id: comments[index]._id }));

      return {
        id,
        author,
        title,
        content,
        createdAt,
        comments: commentsWithIDS
      };
    },
    posts: async (_: any, { user, limit, offset }: { user: string; limit: number; offset: number }) => {
      let posts: Array<any>;

      if (user === 'any') posts = await db.collection('posts').find({}).skip(offset).limit(limit).sort({ createdAt: -1 }).toArray();
      else posts = await db.collection('posts').find({ author: user }).skip(offset).limit(limit).sort({ createdAt: -1 }).toArray();

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
