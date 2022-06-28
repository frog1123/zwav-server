"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const path_1 = require("path");
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ApolloServer, gql } = require('apollo-server');
const load_1 = require("@graphql-tools/load");
const graphql_file_loader_1 = require("@graphql-tools/graphql-file-loader");
const post_1 = require("./resolvers/post");
const user_1 = require("./resolvers/user");
console.log(process.env.DB_URL);
const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(() => console.log('Connected to database'));
exports.db = client.db();
const insertPost = () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.db.collection('posts').insertOne({
        title: 'first post',
        content: 'the content'
    });
});
const schema = (0, load_1.loadSchemaSync)((0, path_1.join)('src', './schemas/*.gql'), { loaders: [new graphql_file_loader_1.GraphQLFileLoader()] });
const server = new ApolloServer({ typeDefs: schema, resolvers: [post_1.post, user_1.user] });
server.listen(9000).then(({ url }) => console.log(`Server listening on ${url}`));
//# sourceMappingURL=index.js.map