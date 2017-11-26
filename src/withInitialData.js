import { withPropsOnChange } from 'recompose';
import FormSchema from './Schema';

export default withPropsOnChange(['initialData', 'validator'], ({ validator, initialData }) => {
  const Schema = new FormSchema({
    model: initialData,
    validator,
  });

  return {
    schema: Schema,
  };
});
