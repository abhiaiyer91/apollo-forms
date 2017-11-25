import _formContextTypes from './_formContextTypes';
import { withContext } from 'recompose';

export default withContext(
  _formContextTypes,
  ({
    schema,
    onChange,
    inputQuery,
    formName,
    FormClient,
    initialData,
  }) => {
    return {
      initialData,
      schema,
      FormClient,
      onChange,
      inputQuery,
      formName,
    };
  }
);
