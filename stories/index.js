import React from 'react';
import { storiesOf } from '@storybook/react';
import gql from 'graphql-tag';
import {
  combineValidators,
  composeValidators,
  isRequired,
  isNumeric,
} from 'revalidate';
import { compose, withProps } from 'recompose';
import FormProvider from '../src/FormProvider';
import createForm from '../src/withForm';
import createHydrateProvider from '../src/createHydrateProvider';
import { Input } from './Inputs';
import SimpleForm from './SimpleForm';

function SubmitControls() {
  return <button type="submit">Submit</button>;
}

storiesOf('Forms', module)
  .add('Simple Example', () => {
    return <SimpleForm />;
  })
  .add('Form w/ scroll to invalid key', () => {
    return (
      <div>
        <SimpleForm />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  })
  .add('Hydrating Form', () => {
    const sampleMutation = gql`
      mutation($inputData: PersonInput) {
        createSample(inputData: $inputData)
      }
    `;

    const inputQuery = gql`
      {
        sampleForm @client {
          name
          age
        }
      }
    `;

    const errorsQuery = gql`
      {
        sampleFormErrors @client {
          name
          age
        }
      }
    `;

    const hydrationQuery = gql`
      query sample {
        sampleForm {
          name
          age
        }
      }
    `;

    const sampleValidator = combineValidators({
      name: composeValidators(isRequired)('Name'),
      age: composeValidators(isRequired, isNumeric)('Age'),
    });

    const Form = compose(
      withProps({
        validator: sampleValidator,
      }),
      createForm({ mutation: sampleMutation, inputQuery, errorsQuery })
    )(FormProvider);

    const HydrateProvider = createHydrateProvider({
      query: hydrationQuery,
      queryKey: 'sampleForm',
    });

    return (
      <HydrateProvider>
        {(data) => {
          return (
            <Form
              initialData={data}
              onSuccess={() => {
                return alert('Submitted!');
              }}
              onError={() => {
                alert('ERRORED');
              }}
              onErrorMessage={(errorMessage) => {
                const errorKeys = Object.keys(errorMessage);
                errorKeys &&
                  errorKeys.length > 0 &&
                  alert(errorMessage[errorKeys[0]]);
              }}
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
  });
