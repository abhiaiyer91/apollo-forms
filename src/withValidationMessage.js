import React from 'react';

export default function withValidationMessage(BaseComponent) {
  return ({ validationMessage, hasError, value, ...rest }) => {
    return (
      <section>
        <BaseComponent value={value} {...rest} />
        {hasError && <p>{validationMessage}</p>}
      </section>
    );
  };
}
