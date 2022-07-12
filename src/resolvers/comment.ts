import { ObjectId } from 'mongodb';
import { db } from '../index';

export const comment = {
  Query: {
    comments: async (_: any, { user, limit, offset }: { user: string; limit: number; offset: number }) => {
      const comments = await db.collection('comments').find({ author: user }).skip(offset).limit(limit).sort({ createdAt: -1 }).toArray();

      const commentsWithInfo = await Promise.all(
        comments.map(async (obj: any, index: number) => {
          const author = await db.collection('users').findOne({ _id: new ObjectId(comments[0].author) });
          const replyingTo = await db.collection('users').findOne({ _id: new ObjectId(comments[0].author) });

          return {
            ...obj,
            id: comments[index]._id,
            replyingTo: {
              id: comments[index].replyingTo,
              author: {
                id: replyingTo._id,
                username: replyingTo.username,
                createdAt: replyingTo.createdAt
              }
            },
            author: {
              id: author._id,
              username: author.username,
              createdAt: author.createdAt
            }
          };
        })
      );

      return await commentsWithInfo;
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
