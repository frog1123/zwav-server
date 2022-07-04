import { Url } from 'url';
import { join } from 'path';
require('dotenv').config();
const gradient = require('gradient-string');

const { MongoClient, ServerApiVersion } = require('mongodb');

const { ApolloServer, gql } = require('apollo-server');
import { loadSchemaSync } from '@graphql-tools/load';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';

import { post } from './resolvers/post';
import { comment } from './resolvers/comment';

const color = gradient(['#436ebc', 'f00']);

const client = new MongoClient(process.env.DB_URL);
client.connect(() => console.log(`🌴 Connected to ${color('database')}`));
export const db = client.db();

const schema = loadSchemaSync(join('src', './schemas/*.gql'), { loaders: [new GraphQLFileLoader()] });
const server = new ApolloServer({ typeDefs: schema, resolvers: [post, comment] });

server.listen(9000).then(({ url }: { url: Url }) => console.log(`🌴 Server listening on ${color(url)}`));
