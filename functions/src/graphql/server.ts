import { ApolloServer } from 'apollo-server-express';

import typeDefs from './schema';
import resolvers from './resolvers';
import auth from './middleware/auth';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: auth,
  introspection: true,
  playground: true
});

export default apolloServer;
