export const user = {
  Query: {
    user: (_: any, { id }: { id: string }) => ({
      id: id,
      username: 'dave'
    })
  }
};
