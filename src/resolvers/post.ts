import { ObjectId } from 'mongodb';
import { db } from '../index';

export const post = {
  Query: {
    post: async (_: any, { id, commentsLimit, commentsOffset }: { id: string; commentsLimit: number; commentsOffset: number }) => {
      const { title, content, author, createdAt } = await db.collection('posts').findOne({ _id: new ObjectId(id) });

      const comments = await db
        .collection('comments')
        .find({ replyingTo: new ObjectId(id) })
        .skip(commentsOffset)
        .limit(commentsLimit)
        .sort({ createdAt: -1 })
        .toArray();

      const commentsWithInfo = await Promise.all(
        comments.map(async (obj: any, index: number) => {
          const { _id, username, pfpLink, bannerColor, createdAt } = await db.collection('users').findOne({ _id: new ObjectId(comments[0].author) });
          return {
            ...obj,
            id: comments[index]._id,
            author: {
              id: _id,
              username,
              pfpLink,
              bannerColor,
              createdAt
            }
          };
        })
      );

      const authorInfo = await db.collection('users').findOne({ _id: new ObjectId(author) });

      return {
        id,
        author: {
          id: authorInfo._id,
          username: authorInfo.username,
          pfpLink: authorInfo.pfpLink,
          bannerColor: authorInfo.bannerColor,
          createdAt: authorInfo.createdAt
        },
        title,
        content,
        createdAt,
        comments: commentsWithInfo
      };
    },
    posts: async (_: any, { user, limit, offset }: { user: string; limit: number; offset: number }) => {
      let posts: Array<any>;

      if (user === 'any') posts = await db.collection('posts').find({}).skip(offset).limit(limit).sort({ createdAt: -1 }).toArray();
      else posts = await db.collection('posts').find({ author: user }).skip(offset).limit(limit).sort({ createdAt: -1 }).toArray();

      const postsWithInfo = posts.map(async (obj: any, index: number) => {
        const { _id, username, pfpLink, bannerColor, createdAt } = await db.collection('users').findOne({ _id: new ObjectId(posts[index].author) });

        return {
          ...obj,
          id: posts[index]._id,
          author: {
            id: _id,
            username,
            pfpLink,
            bannerColor,
            createdAt
          }
        };
      });
      return postsWithInfo;
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
