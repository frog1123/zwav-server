import { Url } from 'url';
import { join } from 'path';
require('dotenv').config();

const { MongoClient, ServerApiVersion } = require('mongodb');

const { ApolloServer, gql } = require('apollo-server');
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';

import { post } from './resolvers/post';
import { user } from './resolvers/user';

console.log(process.env.DB_URL);

const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(() => console.log('Connected to database'));
const db = client.db();

const insertPost = async () => {
  await db.collection('posts').insertOne({
    title: 'first post',
    content: 'the content'
  });
};
// insertPost();

const schema = loadSchemaSync(join('src', './schemas/*.gql'), { loaders: [new GraphQLFileLoader()] });
const server = new ApolloServer({ typeDefs: schema, resolvers: [post, user] });

server.listen(9000).then(({ url }: { url: Url }) => console.log(`Server listening on ${url}`));
