import React from 'react';
import { graphql } from 'react-apollo';
import { compose, withProps } from 'recompose';

function FormRender({ LoadingComponent, loading, children, data }) {
  if (loading && !!LoadingComponent) {
    return <LoadingComponent />;
  }

  if (loading && !LoadingComponent) {
    return null;
  }

  return children(data);
}

function withFormHydrate({ queryKey, query, options = {} }) {
  if (!queryKey) {
    throw new Error('Must provide queryKey');
  }
  return compose(
    graphql(query, options),
    withProps(({ data }) => {
      return {
        data: data && data[queryKey],
        loading: data && data.loading,
      };
    })
  );
}

export default function createHydrateProvider({
  queryKey,
  query,
  options,
}) {
  return withFormHydrate({ queryKey, query, options })(FormRender);
}
