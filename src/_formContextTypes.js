import PropTypes from 'prop-types';

export default {
  FormClient: PropTypes.any,
  onChange: PropTypes.func,
  formName: PropTypes.string,
  schema: PropTypes.any,
  inputQuery: PropTypes.any,
  errorsQuery: PropTypes.any,
  initialData: PropTypes.any,
};
