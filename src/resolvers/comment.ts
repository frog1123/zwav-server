import { ObjectId } from 'mongodb';
import { db } from '../index';

export const comment = {
  Query: {
    comments: async (_: any, { user, limit, offset }: { user: string; limit: number; offset: number }) => {
      return await db.collection('comments').find({ author: user }).skip(offset).limit(limit).sort({ createdAt: -1 }).toArray();
    }
  },
  Mutation: {
    createComment: async (_: any, { postId, author, content, createdAt }: { postId: string; author: string; content: string; createdAt: string }) => {
      if (content.length === 0) return;

      await db.collection('comments').insertOne({
        replyingTo: new ObjectId(postId),
        author,
        content,
        createdAt
      });

      return 'success';
    }
  }
};
