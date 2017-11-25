import {
  compose,
  getContext,
  withState,
  withHandlers,
  mapProps,
  withPropsOnChange,
} from 'recompose';
import { hasErrorAt } from 'revalidate/assertions';
import _formContextTypes from './_formContextTypes';

export default compose(
  withState('internalValue', 'setInternalValue', null),
  withState('isClean', 'setIsClean', true),
  getContext(_formContextTypes),
  withPropsOnChange(
    ['internalValue', 'initialData'],
    ({
      internalValue,
      FormClient,
      inputQuery,
      isClean,
      schema,
      field,
      formName,
      initialData = {},
    }) => {

      let data;

      try {
        data = FormClient.readQuery({ query: inputQuery });
      } catch (e) {
        data = {};
      }

      const formData = data && data[formName];

      const fieldMessages = schema.validate(formData);

      const validationMessage = fieldMessages && fieldMessages[field];

      return {
        validationMessage,
        value: !!internalValue ? internalValue : initialData && initialData[field],
        hasError: !isClean && hasErrorAt(fieldMessages, field),
      };
    }
  ),
  withHandlers({
    onChange: ({ field, setInternalValue, onChange, setIsClean }) => {
      return (e) => {
        const value = e.target.value;
        setInternalValue(value);
        return onChange({
          field,
          value,
          onUpdate: () => {
            return setIsClean(false);
          },
        });
      };
    },
  }),
  mapProps(({ type, onChange, field, value, hasError }) => {
    return {
      type,
      onChange,
      name: field,
      value,
      hasError,
    };
  })
);
