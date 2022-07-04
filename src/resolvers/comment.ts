import { ObjectId } from 'mongodb';
import { db } from '../index';

export const comment = {
  Mutation: {
    createComment: async (_: any, { postId, author, content, createdAt }: { postId: string; author: string; content: string; createdAt: string }) => {
      if (content.length === 0) return;

      await db.collection('comments').insertOne({
        replyingTo: new ObjectId(postId),
        _id: new ObjectId(),
        author,
        content,
        createdAt
      });

      return 'success';
    }
  }
};
