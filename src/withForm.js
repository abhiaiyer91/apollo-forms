import { compose, mapProps } from 'recompose';
import { pick } from 'lodash';
import withFormClient from './withFormClient';
import withFormData from './withFormData';
import withFormOnChange from './withFormOnChange';
import withFormContext from './withFormContext';
import withFormSubmit from './withFormSubmit';

export default function createForm({ mutation }) {
  return compose(
    withFormClient,
    withFormData,
    withFormOnChange,
    withFormContext,
    withFormSubmit(mutation),
    mapProps((props) => {
      return pick(props, ['onSubmit', 'children']);
    }),
  );
}
