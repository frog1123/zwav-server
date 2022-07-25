import { join } from 'path';
import 'dotenv/config';
const gradient = require('gradient-string');

const { MongoClient } = require('mongodb');
import { ApolloServer } from 'apollo-server-express';
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import express, { Request as req, Response as res } from 'express';
const cors = require('express-cors');

//rest
const hello = require('./rest/hello');

// graphql
import { post } from './graphql/resolvers/post';
import { comment } from './graphql/resolvers/comment';
import { user } from './graphql/resolvers/user';

const color = gradient(['#436ebc', 'f00']);

const client = new MongoClient(process.env.DB_URL);
client.connect(() => console.log(`🌴 Connected to ${color('database')}`));
export const db = client.db();

(async () => {
  const app = express();

  app.use(cors({ credentials: true, allowedOrgins: ['http://localhost:3000', 'https://studio.apollographql.com'] }));

  app.use('/rest', hello);

  const schema = loadSchemaSync(join('src', './graphql/schemas/*.gql'), { loaders: [new GraphQLFileLoader()] });
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: [post, comment, user],
    context: ({ req, res }: { req: req; res: res }) => ({ req, res })
  });

  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: ['http://localhost:3000', 'https://studio.apollographql.com']
    }
  });

  app.listen(process.env.PORT ?? 9000, () => console.log(`🌴 Server listening on port ${color(process.env.PORT ?? 9000)}`));
})();
