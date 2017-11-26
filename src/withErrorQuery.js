import React from 'react';
import { graphql } from 'react-apollo';

export default function withErrorQuery(BaseComponent) {
  return ({ errorsQuery, ...rest }) => {
    const WrappedBaseComponent = graphql(errorsQuery, {
      name: 'errorData',
    })(BaseComponent);

    return <WrappedBaseComponent errorsQuery={errorsQuery} {...rest} />;
  };
}
