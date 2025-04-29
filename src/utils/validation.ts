import { FormField, FormValues, FormErrors } from "../types";

export const validateField = (
  field: FormField,
  value: string | string[] | boolean | undefined
): string => {
  // Check if field is required but empty
  if (
    field.required &&
    (value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0))
  ) {
    return field.validation?.message || `${field.label} is required`;
  }

  // Skip further validation if field is empty and not required
  if (
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return "";
  }

  // Type-specific validations
  if (typeof value === "string") {
    // Check minLength
    if (field.minLength !== undefined && value.length < field.minLength) {
      return `${field.label} must be at least ${field.minLength} characters`;
    }

    // Check maxLength
    if (field.maxLength !== undefined && value.length > field.maxLength) {
      return `${field.label} must be no more than ${field.maxLength} characters`;
    }

    // Email validation
    if (field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address";
    }

    // Phone validation
    if (field.type === "tel" && !/^\d{10}$/.test(value.replace(/\D/g, ""))) {
      return "Please enter a valid 10-digit phone number";
    }
  }

  return "";
};

export const validateSection = (
  fields: FormField[],
  values: FormValues
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};
  let isValid = true;

  fields.forEach((field) => {
    const value = values[field.fieldId];
    const errorMessage = validateField(field, value);

    if (errorMessage) {
      errors[field.fieldId] = errorMessage;
      isValid = false;
    }
  });

  return { isValid, errors };
};
