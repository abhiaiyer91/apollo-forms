import { withProps } from 'recompose';

export default withProps(({ FormClient, formName, inputQuery }) => {
  let currentData;

  try {
    currentData = FormClient.readQuery({
      query: inputQuery,
    });
  } catch (e) {
    currentData = {};
  }

  return {
    dataFromStore: currentData,
    formData: currentData && currentData[formName],
  };
});
