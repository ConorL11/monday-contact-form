// forces a general email like structure for email fields
function validateEmail(value) {
  // Allow empty values
  if (!value) {
    return { status: "", text: "" };
  }
  // Basic regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return { status: "error", text: "Please enter a valid email address." };
  }
  return { status: "", text: "" };
}


// forces any entry into fields designated as name fields
function validateName(value){

  // force at least one character into the name field for contact updates
  if(value?.length === 0) {
      return {status: "error", text: "Please enter a value into this name field"}
  }

  return { status: "", text: "" };

}

export { validateEmail, validateName }