import {
  compose,
  getContext,
  withState,
  withHandlers,
  lifecycle,
  mapProps,
  withProps,
} from 'recompose';
import React from 'react';
import { graphql } from 'react-apollo';
import _formContextTypes from './_formContextTypes';

function withErrorQuery(BaseComponent) {
  return ({ errorsQuery, ...rest }) => {
    const WrappedBaseComponent = graphql(errorsQuery, {
      name: 'errorData',
    })(BaseComponent);

    return <WrappedBaseComponent errorsQuery={errorsQuery} {...rest} />;
  };
}

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
  withHandlers({
    onChange: ({
      field,
      FormClient,
      errorsQuery,
      formData,
      schema,
      formName,
      setInternalValue,
      onChange,
    }) => {
      return (e) => {
        const value = e.target.value;
        setInternalValue(value);

        return onChange({
          field,
          value,
          onUpdate: () => {
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
          },
        });
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
