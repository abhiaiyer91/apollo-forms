import React from 'react';
import gql from 'graphql-tag';
import {
  combineValidators,
  composeValidators,
  isRequired,
  isAlphabetic,
  isNumeric,
} from 'revalidate';
import { compose } from 'recompose';
import FormSchema from '../src/Schema';
import createForm from '../src/withForm';
import withValidationMessage from '../src/withValidationMessage';
import withInput from '../src/withInput';

function SubmitControls() {
  return <button type="submit">Submit</button>;
}

const sampleMutation = gql`
  mutation($inputData: PersonInput) {
    createSample(inputData: $inputData)
  }
`;

const Form = createForm({ mutation: sampleMutation })('form');
const Input = compose(withInput, withValidationMessage)('input');

const sampleValidator = combineValidators({
  name: composeValidators(isRequired, isAlphabetic)('Name'),
  age: composeValidators(isRequired, isNumeric)('Age'),
});

const Schema = new FormSchema({
  model: {
    name: null,
    age: null,
  },
  validator: sampleValidator,
});

const query = gql`
  {
    sampleForm @client {
      name
      age
    }
  }
`;

export default function SimpleForm() {
  return (
    <Form
      onSuccess={() => {
        return console.log('Submitted!');
      }}
      onError={() => {
        console.log('ERRORED');
      }}
      onErrorMessage={(errorMessage) => {
        const errorKeys = Object.keys(errorMessage);
        console.log('**** ERRORS', errorMessage[errorKeys[0]]);
      }}
      formName="sampleForm"
      schema={Schema}
      inputQuery={query}
    >
      <Input field="name" />
      <Input type="number" field="age" />
      <SubmitControls />
    </Form>
  );
}
