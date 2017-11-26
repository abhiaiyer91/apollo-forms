import { configure, addDecorator } from '@storybook/react';
import apolloStorybookDecorator from 'apollo-storybook-react';

const typeDefs = `
  input PersonInput {
    name: String!
    age: Int!
    description: String!
  }

  type Person {
    name: String
    age: Int
    description: String
  }

  type Query {
    sampleForm: Person
  }

  type Mutation {
    createSample(inputData: PersonInput): Boolean
  }
`;

addDecorator(
  apolloStorybookDecorator({
    typeDefs,
    mocks: {},
  })
);

function loadStories() {
  require('../stories');
}

configure(loadStories, module);
