export default class Schema {
  constructor({ validator, validationMessages = {}, model }) {
    this.validator = validator;
    this.validationMessages = validationMessages;
    this.model = model;
  }

  getInitialState() {
    return this.model;
  }

  validate(formData) {
    return this.validator(formData);
  }

  getValidationMessageByField({ formData, field, useCustomMessage = false }) {
    if (useCustomMessage) {
      return this.validationMessages[field];
    }

    const message = this.validate(formData);

    return message && message[field];
  }
}
