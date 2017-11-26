# Creating a Form

## 1. Create a Client query

### 1a. Create a fragment to represent your form field keys

```js
import gql from 'graphql-tag';

const fragment = gql`
  fragment client on ClientData {
    name
    age
  }
`;
```

### 1b. Create a query for your form state

```js
import gql from 'graphql-tag';

const inputQuery = gql`
  ${fragment}
  {
    sampleForm @client {
      ...client
    }
  }
`;
```

### 1b. Create a query to represent your error state

Error queries are namespaced like so: `{FORM_NAME}Errors`

```js
import gql from 'graphql-tag';

const errorsQuery = gql`
  ${fragment}
  {
    sampleFormErrors @client {
      ...client
    }
  }
`;
```

## 2. Creating Initial Props

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
const initialData = {
  name: null,
  age: null,
}
```

## 3. Create a Form Provider w/ formName, and initialData

### 3a. Create your Submit Mutation
```js
const sampleMutation = gql`
  mutation($inputData: PersonInput) {
    createSample(inputData: $inputData)
  }
`;
```

### 3b. Create your form
```js
import { createForm, FormSchema, FormProvider } from 'apollo-forms';

const Form = createForm({ mutation: sampleMutation, inputQuery, errorsQuery })(FormProvider);
```

### 3c. Pass in initialData and a formName

```js
export default function Root() {
  return (
    <Form
      initialData={initialData}
      formName="sampleForm"
    >
    </Form>
  );
}
```

## 4. Create an Input w/ a field prop

```js
import { withInput } from 'apollo-forms';

const Input = withInput('input');

export default function Root() {
  return (
    <Form
      formName="sampleForm"
    >
      <Input
        field="name"
      />
      <Input
        type="number"
        field="age"
      />
    </Form>
  );
}
```

## 5. Add a Submit Control

```js
export default function Root() {
  return (
    <FormProvider
      formName="sampleForm"
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

# Hydrating a Form

As long as a `FormProvider` gets `initialData` the form will hydrate the appropriate fields in the form.
There are some utils provided that may help you hydrate your Form:

## 1. Create a HydrateProvider

```js
import { createHydrateProvider } from 'apollo-forms';

const query = gql`
  {
    query sample {
      sampleForm {
        name
        age
      }
    }
  }
`;

const HydrateProvider = createHydrateProvider({
  query,
  queryKey: 'sampleForm',
});
```

## 2. Use a render prop to pass it into your form:

```js
export default function Root() {
  return (
    <HydrateProvider>
      {(data) => {
        return (
          <Form
            initialData={data}
            formName="sampleForm"
          >
            <Input field="name" />
            <Input type="number" field="age" />
            <SubmitControls />
          </Form>
        );
      }}
    </HydrateProvider>
  );
}
```

## 3. Or use withHandlers

```js
import { withHandlers } from 'recompose';

function Root({ renderForm }) {
  return (
    <HydrateProvider>
      {renderForm}
    </HydrateProvider>
  );
}

export default withHandlers({
  renderForm: () => {
    return (data) => {
      return (
        <Form
          initialData={data}
          formName="sampleForm"
        >
          <Input field="name" />
          <Input type="number" field="age" />
          <SubmitControls />
        </Form>
      );
    }
  }
})(Root);
```

# How this works

Under the hood, `apollo-forms` creates a `ApolloClient` instance with `apollo-linked-state`. The form gets its own
state graph to work with keyed off `formName`. When `onChange` is called from the `Input` components, both internal react state is updated as well as the local `ApolloClient` cache.

Validation through the `revalidate` library is run when the inputs have values and validation messages are passed as props to the base component.

`onSubmit`, the `FormProvider` component takes the form state and passes it to the supplied `mutation` in the form. By default the variables are formatted like this: `{ inputData: FORM_STATE }`. To customize your mutation arguments, pass a `transform` to the FormProvider to return the form state however you wish.
