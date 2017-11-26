import { compose, withProps } from 'recompose';
import { graphql } from 'react-apollo';
import withFormClient from './withFormClient';
import withFormData from './withFormData';
import withFormOnChange from './withFormOnChange';
import withFormContext from './withFormContext';
import withFormSubmit from './withFormSubmit';

export default function createForm({ mutation, inputQuery, errorsQuery }) {
  return compose(
    withProps(() => {
      return {
        inputQuery,
        errorsQuery,
      };
    }),
    withFormClient,
    withFormData,
    withFormOnChange,
    withFormContext,
    withFormSubmit(mutation),
  );
}
