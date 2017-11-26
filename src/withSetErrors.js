import { withHandlers } from 'recompose';
import { noop } from 'lodash';
import scrollToInvalidKey from './scrollToInvalidKey';
import setErrors from './setErrors';

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

        setErrors({
          query: errorsQuery,
          client: FormClient,
          formName,
          errorMessage,
        });

        onErrorMessage(errorMessage);

        return true;
      }
      return false;
    };
  },
});
