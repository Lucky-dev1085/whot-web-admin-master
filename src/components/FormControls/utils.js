export const getFormValues = formFields => {
  if (!formFields || !(typeof formFields === 'object') || formFields[0]) {
    return null;
  }

  let formValues = {};

  Object.keys(formFields).forEach(key => {
    formValues[key] =
      typeof formFields[key] === 'string'
        ? formFields[key].value.trim()
        : formFields[key].value;
  });

  return formValues;
};

export const getUpdatedFormFields = (formFields, valuesData) => {
  if (
    !formFields ||
    !(typeof formFields === 'object') ||
    formFields[0] ||
    !valuesData ||
    !(typeof valuesData === 'object')
  ) {
    return null;
  }

  const newFormFields = JSON.parse(JSON.stringify(formFields));

  Object.keys(valuesData).forEach(key => {
    if (newFormFields.hasOwnProperty(key)) {
      newFormFields[key].value = valuesData[key];
    }
  });

  return newFormFields;
};

export const isFormValid = formFields => {
  return Object.values(formFields).every(value => value.isValid);
};

export const getInputValidity = ({ value, required, minLength, pattern }) => {
  // firefox doesn't update input validiy object on autocomplete using their suggested value
  const patternRegex = pattern && new RegExp(pattern);

  const validity = {
    patternMismatch: patternRegex ? !patternRegex.test(value) : false,
    tooShort: value.length < minLength,
    valueMissing: required && !value
  };

  validity.valid = !Object.values(validity).includes(true);

  return validity;
};
