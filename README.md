# Creating a Form

## 1. Create a Client query

```js
import gql from 'graphql-tag';

const inputQuery = gql`
  {
    sampleForm @client {
      name
      age
    }
  }
`;
```

This query represents our form state.

## 2. Create a Schema

### 2a. Create a validator

```js
import { combineValidators, composeValidators } from 'revalidate';

const validator = combineValidators({
  name: composeValidators(isRequired, isAlphabetic)('Name'),
  age: composeValidators(isRequired, isNumeric)('Age'),
});
```

### 2b. Supply Initial State

```js
const model = {
  name: null,
  age: null,
}
```

### 2c. Instantiate Schema

```js
import { FormSchema } from 'apollo-forms';

const schema = new FormSchema({
  model,
  validator,
});
```

## 3. Create your Form Provider w/ formName, inputQuery, and create the component with a mutation to run on "submit"

```js
import { createForm, FormSchema } from 'apollo-forms';

const schema = new FormSchema({
  model,
  validator,
});

const sampleMutation = gql`
  mutation($inputData: PersonInput) {
    createSample(inputData: $inputData)
  }
`;

const FormProvider = createForm({ mutation: sampleMutation })('form');

export default function Root() {
  return (
    <FormProvider
      inputQuery={inputQuery}
      schema={schema}
    >
    </FormProvider>
  );
}
```

## 4. Create an Input w/ a field prop

```js
import { withInput, withValidationMessage } from 'apollo-forms';

const Input = compose(withInput, withValidationMessage)('input');

export default function Root() {
  return (
    <FormProvider
      inputQuery={inputQuery}
      schema={schema}
    >
      <Input
        field="name"
      />
      <Input
        type="number"
        field="age"
      />
    </FormProvider>
  );
}
```

## 5. Add a Submit Control

```js
export default function Root() {
  return (
    <FormProvider
      inputQuery={inputQuery}
      schema={schema}
    >
      <Input
        field="name"
      />
      <Input
        type="number"
        field="age"
      />
      <button type="submit">Submit</button>
    </FormProvider>
  );
}
```

# How this works

Under the hood, `apollo-forms` creates a `ApolloClient` instance with `apollo-linked-state`. The form gets its own
state graph to work with keyed off `formName`. When `onChange` is called from the `Input` components, both internal react state is updated as well as the local `ApolloClient` cache.

Validation through the `revalidate` library is run when the inputs have values and validation messages are passed as props to the base component.

`onSubmit`, the `FormProvider` component takes the form state and passes it to the supplied `mutation` in the form. By default the variables are formatted like this: `{ inputData: FORM_STATE }`. To customize your mutation arguments, pass a `transform` to the FormProvider to return the form state however you wish.
