import { gql } from 'apollo-server-express';

const schema = gql`
  type User {
    id: ID
    email: String!
    displayName: String!
    password: String
  }

  type Post {
    id: ID!
    user_id: String!
    title: String!
    body: String!
    timestamp: String!
  }

  type Register {
    message: String!
  }

  type Login {
    user: User!
    token: String!
  }

  type Query {
    profile: User!
    posts: [Post]!
    post(id: String!): Post!
  }

  type Mutation {
    login(email: String!, password: String!): Login!
    register(displayName: String!, email: String!, password: String!): Register!
    createPost(title: String!, body: String!): Post!
  }
`;

export default schema;
