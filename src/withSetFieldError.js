import { withHandlers } from 'recompose';
import getErrorFields from './getErrorFields';

export default withHandlers({
  setFieldError: ({ formName, errorsQuery, FormClient, schema, formData }) => {
    return ({ field, value }) => {
      const errorFields = getErrorFields({ client: FormClient, errorsQuery });

      let errorData = errorFields[`${formName}Errors`];

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

      errorData = {
        ...errorData,
        ...isFieldInValidation,
      };

      errorFields[`${formName}Errors`] = errorData;

      return FormClient.writeQuery({
        query: errorsQuery,
        data: errorFields,
      });
    };
  },
});
