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
exports.post = void 0;
const mongodb_1 = require("mongodb");
const index_1 = require("../index");
exports.post = {
    Query: {
        post: (_, { id }) => __awaiter(void 0, void 0, void 0, function* () {
            const { _id, author, title, content, createdAt } = yield index_1.db.collection('posts').findOne({ _id: new mongodb_1.ObjectId(id) });
            return {
                id: _id,
                author: author,
                title: title,
                content: content,
                createdAt: createdAt
            };
        }),
        posts: () => __awaiter(void 0, void 0, void 0, function* () {
            const posts = yield index_1.db.collection('posts').find({}).sort({ $natural: -1 }).toArray();
            const postsWithIDs = posts.map((obj, index) => (Object.assign(Object.assign({}, obj), { id: posts[index]._id })));
            return postsWithIDs;
        })
    },
    Mutation: {
        createPost: (_, { author, title, content, createdAt }) => __awaiter(void 0, void 0, void 0, function* () {
            if (title.length === 0)
                return;
            const post = yield index_1.db.collection('posts').insertOne({
                author: author,
                title: title,
                content: content,
                createdAt: createdAt
            });
            return yield index_1.db.collection('posts').findOne({ _id: post.insertedId });
        })
    }
};
//# sourceMappingURL=post.js.map