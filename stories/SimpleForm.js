import React from 'react';
import gql from 'graphql-tag';
import {
  combineValidators,
  composeValidators,
  isRequired,
  isAlphabetic,
  isNumeric,
  hasLengthGreaterThan,
} from 'revalidate';
import createForm from '../src/withForm';
import FormProvider from '../src/FormProvider';
import { Input, TextArea, Select } from './Inputs';

function SubmitControls() {
  return <button type="submit">Submit</button>;
}

const sampleMutation = gql`
  mutation($inputData: PersonInput) {
    createSample(inputData: $inputData)
  }
`;

const fragment = gql`
  fragment client on ClientData {
    name
    age
    city
    description
  }
`;

const query = gql`
  {
    sampleForm @client {
      ...client
    }
  }
  ${fragment}
`;

const errorsQuery = gql`
  {
    sampleFormErrors @client {
      ...client
    }
  }
  ${fragment}
`;

const Form = createForm({
  mutation: sampleMutation,
  inputQuery: query,
  errorsQuery: errorsQuery,
})(FormProvider);

const sampleValidator = combineValidators({
  name: composeValidators(isRequired, isAlphabetic)('Name'),
  age: composeValidators(isRequired, isNumeric)('Age'),
  description: composeValidators(hasLengthGreaterThan('1'))('Description'),
  city: composeValidators(isRequired, hasLengthGreaterThan('1'))('City'),
});

const initialData = {
  name: null,
  age: null,
  description: null,
  city: null,
};

export default function SimpleForm() {
  return (
    <Form
      validator={sampleValidator}
      initialData={initialData}
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
    >
      <Input field="name" />
      <Input type="number" field="age" />
      <TextArea field="description" />
      <Select
        field="city"
        options={[
          { label: 'Los Angeles', value: 'LA' },
          { label: 'New York', value: 'NYC' },
        ]}
      />

      <SubmitControls />
    </Form>
  );
}
