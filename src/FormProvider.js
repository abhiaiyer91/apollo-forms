import React from 'react';
import { pick } from 'lodash';
import { ApolloProvider } from 'react-apollo';

export default function FormProvider({ FormClient, children, ...rest }) {
  return (
    <ApolloProvider client={FormClient}>
      <form {...pick(rest, ['onSubmit'])}>{children}</form>
    </ApolloProvider>
  );
}
