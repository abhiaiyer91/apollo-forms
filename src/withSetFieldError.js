import { withHandlers } from 'recompose';

export default withHandlers({
  setFieldError: ({ formName, errorsQuery, FormClient, schema, formData }) => {
    return ({ field, value }) => {
      let errorField;

      try {
        errorField = FormClient.readQuery({ query: errorsQuery });
      } catch (error) {
        errorField = {};
      }

      let errorData = errorField[`${formName}Errors`];

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

      errorField[`${formName}Errors`] = errorData;

      return FormClient.writeQuery({
        query: errorsQuery,
        data: errorField,
      });
    };
  },
});
