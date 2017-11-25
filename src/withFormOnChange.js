import { withHandlers } from 'recompose';

export default withHandlers({
  onChange: ({ FormClient, dataFromStore, formData, inputQuery, formName }) => {
    return ({ field, value, onUpdate }) => {
      if (!!field) {
        formData[field] = value;

        dataFromStore[formName] = formData;

        FormClient.writeQuery({
          query: inputQuery,
          data: dataFromStore,
        });

        if (typeof onUpdate === 'function') {
          setTimeout(() => {
            return onUpdate({ field, value });
          }, 100);
        }
      }
    };
  },
});
