import { withProps } from 'recompose';

export default withProps(({ FormClient, formName, inputQuery, schema }) => {
  let currentData;

  try {
    currentData = FormClient.readQuery({
      query: inputQuery,
    });
  } catch (e) {
    currentData = {};
  }

  const initialState = {
    ...schema.getInitialState(),
    __typename: formName,
  };

  return {
    dataFromStore: currentData,
    formData: (currentData && currentData[formName]) || initialState,
  };
});
