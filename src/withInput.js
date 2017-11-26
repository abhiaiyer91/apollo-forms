import {
  compose,
  getContext,
  withState,
  withHandlers,
  lifecycle,
  mapProps,
  withProps,
} from 'recompose';
import withErrorQuery from './withErrorQuery';
import withSetFieldError from './withSetFieldError';
import _formContextTypes from './_formContextTypes';
import withValidationMessage from './withValidationMessage';

export default compose(
  getContext(_formContextTypes),
  withErrorQuery,
  withState('internalValue', 'setInternalValue', ({ initialData, field }) => {
    return (initialData && initialData[field]) || '';
  }),
  withProps(({ FormClient, inputQuery }) => {
    let data;

    try {
      data = FormClient.readQuery({ query: inputQuery });
    } catch (e) {
      data = {};
    }

    return {
      data,
    };
  }),
  withProps(({ internalValue, errorData = {}, formName, field }) => {
    const errorDataFromForm = errorData[`${formName}Errors`];

    const errorDataForField = errorDataFromForm && errorDataFromForm[field];

    return {
      validationMessage: errorDataForField,
      value: internalValue,
    };
  }),
  lifecycle({
    componentDidMount() {
      const { initialData, setInternalValue, field } = this.props;
      const initialValue = (initialData && initialData[field]) || '';

      return setInternalValue(initialValue);
    },
  }),
  withSetFieldError,
  withHandlers({
    onChange: ({ field, setInternalValue, onChange, setFieldError }) => {
      return (e) => {
        const value = e.target.value;
        setInternalValue(value);

        return onChange({
          field,
          value,
          onUpdate: () => {
            return setFieldError({ field, value });
          },
        });
      };
    },
  }),
  withValidationMessage,
  mapProps(({ type, onChange, field, value }) => {
    return {
      type,
      onChange,
      name: field,
      value,
    };
  }),
);
