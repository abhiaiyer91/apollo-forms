import getErrorFields from './getErrorFields';

export default function setErrors({ client, query, formName, errorMessage }) {
  const errorFields = getErrorFields({ client, errorsQuery: query });

  let errorData = errorFields[`${formName}Errors`];

  errorData = {
    ...errorData,
    ...errorMessage,
  };

  errorFields[`${formName}Errors`] = errorData;

  client.writeQuery({
    query: query,
    data: errorFields,
  });
}
