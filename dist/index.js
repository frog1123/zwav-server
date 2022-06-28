"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const path_1 = require("path");
require('dotenv').config();
const gradient = require('gradient-string');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ApolloServer, gql } = require('apollo-server');
const load_1 = require("@graphql-tools/load");
const graphql_file_loader_1 = require("@graphql-tools/graphql-file-loader");
const post_1 = require("./resolvers/post");
const color = gradient(['#436ebc', 'f00']);
const client = new MongoClient(process.env.DB_URL);
client.connect(() => console.log(`🌴 Connected to ${color('database')}`));
exports.db = client.db();
const schema = (0, load_1.loadSchemaSync)((0, path_1.join)('src', './schemas/*.gql'), { loaders: [new graphql_file_loader_1.GraphQLFileLoader()] });
const server = new ApolloServer({ typeDefs: schema, resolvers: [post_1.post] });
server.listen(9000).then(({ url }) => console.log(`🌴 Server listening on ${color(url)}`));
//# sourceMappingURL=index.js.map