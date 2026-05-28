export const isEmpty = value =>
  value === null || value === undefined || String(value).trim() === '';

export const isValidEmail = email =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email).trim());

export const isNumeric = value => /^[0-9]+$/.test(String(value).trim());

export const validateProfileForm = (values, options = {}) => {
  const errors = {};
  const requiredFields = [
    'fullName',
    'phoneNumber',
    'gender',
    'email',
    'language',
  ];

  if (options.requirePassword) {
    requiredFields.push('password');
  }

  requiredFields.forEach(field => {
    if (isEmpty(values[field])) {
      errors[field] = 'Este campo es obligatorio.';
    }
  });

  if (!isEmpty(values.fullName) && values.fullName.trim().length > 50) {
    errors.fullName = 'El nombre completo debe tener máximo 50 caracteres.';
  }

  if (!isEmpty(values.phoneNumber) && !isNumeric(values.phoneNumber)) {
    errors.phoneNumber = 'El teléfono solo debe contener números.';
  }

  if (!isEmpty(values.email) && !isValidEmail(values.email)) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }

  if (
    options.requirePassword &&
    !isEmpty(values.password) &&
    values.password.length < 6
  ) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLoginForm = values => {
  const errors = {};

  if (isEmpty(values.email)) {
    errors.email = 'El correo electrónico es obligatorio.';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Ingresa un correo electrónico válido.';
  }

  if (isEmpty(values.password)) {
    errors.password = 'La contraseña es obligatoria.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
