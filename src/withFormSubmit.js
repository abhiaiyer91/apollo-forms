import { graphql } from 'react-apollo';
import { compose, withHandlers } from 'recompose';
import { noop, omit } from 'lodash';
import withSetErrors from './withSetErrors';

function defaultTransform(props) {
  return { inputData: omit(props, '__typename') };
}

function defaultErrorLogger(e) {
  return console.error(e.message);
}

export default function (mutation) {
  return compose(
    graphql(mutation),
    withSetErrors,
    withHandlers({
      onSubmit: ({
        mutate,
        onSuccess = noop,
        onError = defaultErrorLogger,
        transform = defaultTransform,
        formData,
        variables = {},
        setErrors = noop,
      }) => {
        return (e) => {
          e.preventDefault();

          if (setErrors()) {
            return;
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
