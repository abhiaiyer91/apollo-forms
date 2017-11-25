import { graphql } from 'react-apollo';
import { compose, withHandlers } from 'recompose';

function identity({ __typename, ...rest }) {
  return { inputData: rest };
}

function noop() {}

function defaultErrorLogger(e) {
  return console.error(e.message);
}

export default function (mutation) {
  return compose(
    graphql(mutation),
    withHandlers({
      onSubmit: ({
        mutate,
        schema,
        onErrorMessage = noop,
        onSuccess = noop,
        onError = defaultErrorLogger,
        transform = identity,
        formData,
        variables = {},
      }) => {
        return (e) => {
          e.preventDefault();

          const errorMessage = schema.validate(formData);

          if (
            errorMessage &&
            Object.keys(errorMessage) &&
            Object.keys(errorMessage).length > 0
          ) {
            return onErrorMessage(errorMessage);
          }

          return mutate({
            variables: {
              ...transform(formData),
              ...variables,
            },
          })
            .then(onSuccess)
            .catch(onError);
        };
      },
    })
  );
}
