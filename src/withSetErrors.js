import { withHandlers } from 'recompose';
import { noop } from 'lodash';
import scrollToInvalidKey from './scrollToInvalidKey';
import getErrorFields from './getErrorFields';

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

        const errorFields = getErrorFields({ client: FormClient, errorsQuery });

        let errorData = errorFields[`${formName}Errors`];

        errorData = {
          ...errorData,
          ...errorMessage,
        };

        errorFields[`${formName}Errors`] = errorData;

        FormClient.writeQuery({
          query: errorsQuery,
          data: errorFields,
        });

        onErrorMessage(errorMessage);

        return true;
      }
      return false;
    };
  },
});
