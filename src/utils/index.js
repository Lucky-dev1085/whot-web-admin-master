export const isValidEmail = value => {
  const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,61}$/i;
  return emailRegex.test(value);
};

export const isValidUsername = value => {
  const usernameRegex = /^[0-9a-zA-Z]+$/;
  return usernameRegex.test(value);
};

export const isValidPromoCode = value => {
  if (value.length !== 8) {
    return false;
  }

  const promoCodeRegex = /^[0-9]+$/;
  return promoCodeRegex.test(value);
};

export const isValidPhone = value => {
  const phoneRegex = /^\+?[0-9]+$/g;
  const isValidPattern = phoneRegex.test(value);

  if (!isValidPattern) {
    return false;
  }

  const withCountryCode = value.substring(0, 4) === '+234';
  const withoutCountryCode = value.substring(0, 1) === '0';

  return withCountryCode
    ? value.length === 14
    : withoutCountryCode && value.length === 11;
};

export const isFullName = value => {
  const fullNameRegex = /^[a-zA-Z.'-]+(?: +[a-zA-Z.'-]+)+$/i;
  return fullNameRegex.test(value.trim());
};
