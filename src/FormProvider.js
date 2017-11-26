import React from 'react';
import { ApolloProvider } from 'react-apollo';

export default function FormProvider({ FormClient, children, ...rest }) {
  return (
    <ApolloProvider client={FormClient}>
      <form {...rest}>{children}</form>
    </ApolloProvider>
  );
}
