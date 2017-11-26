import {
  compose,
  getContext,
  withState,
  withHandlers,
  lifecycle,
  mapProps,
  withPropsOnChange,
} from 'recompose';
import { hasErrorAt } from 'revalidate/assertions';
import _formContextTypes from './_formContextTypes';

export default compose(
  withState('internalValue', 'setInternalValue', ({ initialData, field }) => {
    return (initialData && initialData[field]) || '';
  }),
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
        value: internalValue,
        hasError: !isClean && hasErrorAt(fieldMessages, field),
      };
    }
  ),
  lifecycle({
    componentDidMount() {
      const { initialData, setInternalValue, field } = this.props;
      const initialValue = (initialData && initialData[field]) || '';

      return setInternalValue(initialValue);
    },
  }),
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
    onBlur: ({ setIsClean }) => {
      return () => {
        return setIsClean(true);
      };
    },
  }),
  mapProps(({ type, validationMessage, onChange, field, value, hasError }) => {
    return {
      type,
      onChange,
      name: field,
      value,
      hasError,
      validationMessage,
    };
  })
);
