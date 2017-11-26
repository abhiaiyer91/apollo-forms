import { withHandlers } from 'recompose';
import { noop } from 'lodash';
import scrollToInvalidKey from './scrollToInvalidKey';

export default withHandlers({
  setErrors: ({
    schema,
    formData,
    FormClient,
    errorsQuery,
    formName,
    onErrorMessage = noop,
    scrollOnValidKey = true,
  }) => {
    return () => {
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

        onErrorMessage(errorMessage);

        return true;
      }
      return false;
    };
  },
});
