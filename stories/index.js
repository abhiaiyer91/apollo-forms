import React from 'react';
import { storiesOf } from '@storybook/react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import {
  combineValidators,
  composeValidators,
  isRequired,
  isNumeric,
} from 'revalidate';
import { compose, withProps } from 'recompose';
import FormSchema from '../src/Schema';
import FormProvider from '../src/FormProvider';
import createForm from '../src/withForm';
import withValidationMessage from '../src/withValidationMessage';
import withInput from '../src/withInput';
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

    let FormFetcher = function FormFetcher({ loading, children, data }) {
      if (loading) {
        return null;
      }
      return children(data);
    };

    FormFetcher = compose(
      graphql(hydrationQuery),
      withProps(({ data }) => {
        return {
          data: data && data.sampleForm,
          loading: data && data.loading,
        };
      })
    )(FormFetcher);

    const Form = compose(
      withProps(({ initialData }) => {
        const sampleValidator = combineValidators({
          name: composeValidators(isRequired)('Name'),
          age: composeValidators(isRequired, isNumeric)('Age'),
        });

        const Schema = new FormSchema({
          model: initialData,
          validator: sampleValidator,
        });

        return {
          schema: Schema,
        };
      }),
      createForm({ mutation: sampleMutation, inputQuery, errorsQuery })
    )(FormProvider);

    const Input = compose(withInput, withValidationMessage)('input');

    return (
      <FormFetcher>
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
              inputQuery={inputQuery}
            >
              <Input field="name" />
              <Input type="number" field="age" />
              <SubmitControls />
            </Form>
          );
        }}
      </FormFetcher>
    );
  });
