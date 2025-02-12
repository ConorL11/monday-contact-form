import { supportedColumns, itemNameOnCreate } from "./constants";

function validateEmail(value) {
  // Allow empty values
  if (!value) {
    return { valid: true, error: "" };
  }
  // Basic regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return { valid: false, error: "Please enter a valid email address." };
  }
  return { valid: true, error: "" };
}

function validateName(itemNameOnCreate, value){
  // CONOR Fill this out later
}

export { validateEmail, validateName }