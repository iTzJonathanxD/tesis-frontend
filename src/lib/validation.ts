// Email validation
export const validateEmail = (email: string): string | null => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  if (!email) {
    return 'Email is required';
  }

  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  if (!email.endsWith('@uleam.edu.ec')) {
    return 'Email must be from ULEAM institutional domain';
  }

  return null;
};

// Name validation
export const validateName = (name: string): string | null => {
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

  if (!name) {
    return 'Name is required';
  }

  if (name.length < 2) {
    return 'Name must be at least 2 characters long';
  }

  if (name.length > 50) {
    return 'Name cannot exceed 50 characters';
  }

  if (!nameRegex.test(name)) {
    return 'Name can only contain letters and spaces';
  }

  return null;
};

// Password validation
export const validatePassword = (password: string): string | null => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

  if (!password) {
    return 'Password is required';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }

  if (password.length > 128) {
    return 'Password cannot exceed 128 characters';
  }

  if (!passwordRegex.test(password)) {
    return 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
  }

  return null;
};

// Description validation
export const validateDescription = (description: string): string | null => {
  if (description && description.length > 500) {
    return 'Description cannot exceed 500 characters';
  }

  return null;
};

// URL validation
export const validateUrl = (url: string): string | null => {
  const urlRegex = /^https?:\/\/.+/;

  if (url && !urlRegex.test(url)) {
    return 'Please enter a valid URL';
  }

  return null;
};

// Profile photo validation
export const validateProfilePhoto = (url: string): string | null => {
  return validateUrl(url);
};

// Social networks validation
export const validateSocialNetworks = (socialNetworks: {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
}): { [key: string]: string | null } => {
  const errors: { [key: string]: string | null } = {};

  if (socialNetworks.instagram) {
    errors.instagram = validateUrl(socialNetworks.instagram);
  }

  if (socialNetworks.facebook) {
    errors.facebook = validateUrl(socialNetworks.facebook);
  }

  if (socialNetworks.linkedin) {
    errors.linkedin = validateUrl(socialNetworks.linkedin);
  }

  return errors;
};

// Form validation helper
export const validateForm = (
  data: any,
  rules: { [key: string]: (value: any) => string | null }
): { [key: string]: string | null } => {
  const errors: { [key: string]: string | null } = {};

  Object.keys(rules).forEach((field) => {
    const validator = rules[field];
    const value = data[field];
    errors[field] = validator(value);
  });

  return errors;
};

// Check if form has errors
export const hasFormErrors = (errors: {
  [key: string]: string | null;
}): boolean => {
  return Object.values(errors).some((error) => error !== null);
};
