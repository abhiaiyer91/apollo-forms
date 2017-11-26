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
        FormClient,
        errorsQuery,
        scrollOnValidKey = true,
        variables = {},
        formName,
      }) => {
        return (e) => {
          e.preventDefault();

          const errorMessage = schema.validate(formData);
          const errorKeys = Object.keys(errorMessage);

          if (errorMessage && errorKeys && errorKeys.length > 0) {
            if (scrollOnValidKey) {
              scrollToInvalidKey(errorKeys[0]);
            }

            let errorField;

            try {
              errorField = FormClient.readQuery({ query: errorsQuery });
            } catch (error) {
              errorField = {};
            }

            let errorData = errorField[`${formName}Errors`];

            errorData = {
              ...errorData,
              ...errorMessage,
            };

            errorField[`${formName}Errors`] = errorData;

            FormClient.writeQuery({
              query: errorsQuery,
              data: errorField,
            });

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
