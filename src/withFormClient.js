import { compose, withPropsOnChange, lifecycle } from 'recompose';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { withClientState } from 'apollo-link-state';

function createFormState(formName, model) {
  return withClientState({
    Query: {
      [formName]: () => {
        return {
          ...model,
          __typename: formName,
        };
      },
    },
  });
}

export default compose(
  withPropsOnChange(['formName', 'schema'], ({ formName, schema }) => {
    const localState = createFormState(formName, schema.getInitialState());

    const FormClient = new ApolloClient({
      cache: new InMemoryCache(),
      link: localState,
    });

    return {
      FormClient,
    };
  }),
  lifecycle({
    componentDidMount() {
      const { FormClient, inputQuery } = this.props;
      return FormClient.query({ query: inputQuery });
    },
  })
);
