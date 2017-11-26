export default function getErrorFields({ client, errorsQuery }) {
  let errorFields;

  try {
    errorFields = client.readQuery({ query: errorsQuery });
  } catch (error) {
    errorFields = {};
  }

  return errorFields;
}
