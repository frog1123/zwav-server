"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.post = void 0;
exports.post = {
    Query: {
        hello: (_, { name }) => `Hello, ${name}`,
        post: (_, { id }) => ({
            id: id,
            title: 'the title',
            content: 'the content'
        })
    }
};
//# sourceMappingURL=post.js.map