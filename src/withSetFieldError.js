import { withHandlers } from 'recompose';
import setErrors from './setErrors';

export default withHandlers({
  setFieldError: ({ formName, errorsQuery, FormClient, schema, formData }) => {
    return ({ field, value }) => {
      const schemaValidation = schema.validate({
        ...formData,
        [field]: value,
      });

      let isFieldInValidation;

      if (!!schemaValidation[field]) {
        isFieldInValidation = { [field]: schemaValidation[field] };
      } else {
        isFieldInValidation = { [field]: null };
      }

      return setErrors({
        client: FormClient,
        formName,
        query: errorsQuery,
        errorMessage: isFieldInValidation,
      });
    };
  },
});
