export const post = {
  Query: {
    hello: (_: any, { name }: { name: string }) => `Hello, ${name}`,
    post: (_: any, { id }: { id: string }) => ({
      id: id,
      title: 'the title',
      content: 'the content'
    })
  }
};
