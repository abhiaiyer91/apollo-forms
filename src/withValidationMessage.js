import React from 'react';

export default function withValidationMessage(BaseComponent) {
  return ({
    validationMessage,
    hasError,
    ValidationMessageComponent,
    ...rest
  }) => {
    return (
      <section>
        <BaseComponent {...rest} />
        {hasError && (ValidationMessageComponent || <p>{validationMessage}</p>)}
      </section>
    );
  };
}
