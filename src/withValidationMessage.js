import React from 'react';

export default function withValidationMessage(BaseComponent) {
  return ({
    validationMessage,
    ValidationMessageComponent,
    ...rest
  }) => {
    return (
      <section>
        <BaseComponent {...rest} />
        {!!validationMessage && (ValidationMessageComponent || <p>{validationMessage}</p>)}
      </section>
    );
  };
}
