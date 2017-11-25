import React from 'react';

export default function withValidationMessage(BaseComponent) {
  return ({ validationMessage, hasError, ...rest }) => {
    return (
      <section>
        <BaseComponent {...rest} />
        {hasError && <p>{validationMessage}</p>}
      </section>
    );
  };
}
