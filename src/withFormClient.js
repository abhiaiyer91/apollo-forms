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
      [`${formName}Errors`]: () => {
        const modelKeys = Object.keys(model);
        const initialModel = modelKeys.reduce((memo, currentVal) => {
          return {
            ...memo,
            [currentVal]: null,
          };
        }, {});
        return {
          ...initialModel,
          __typename: `${formName}Errors`,
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
      const { FormClient, inputQuery, errorsQuery } = this.props;

      if (!!errorsQuery) {
        FormClient.query({ query: errorsQuery });
      }

      return FormClient.query({ query: inputQuery });
    },
  })
);
