import { graphql } from 'react-apollo';
import { compose, withHandlers } from 'recompose';
import { noop, omit } from 'lodash';
import scrollToInvalidKey from './scrollToInvalidKey';

function defaultTransform(props) {
  return { inputData: omit(props, '__typename') };
}

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
        transform = defaultTransform,
        formData,
        scrollOnValidKey = true,
        variables = {},
      }) => {
        return (e) => {
          e.preventDefault();

          const errorMessage = schema.validate(formData);
          const errorKeys = Object.keys(errorMessage);

          if (errorMessage && errorKeys && errorKeys.length > 0) {
            if (scrollOnValidKey) {
              scrollToInvalidKey(errorKeys[0]);
            }

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
