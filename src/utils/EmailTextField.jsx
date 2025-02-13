import React, { useState } from "react";
import { TextField } from "@vibe/core";
import "../App.css";
import { validateEmail } from "./formEntryValidation";

const EmailTextField = ({ title, value, onChange, ...rest }) => {
  const [error, setError] = useState("");

    const handleChange = (newValue) => {
        // Notify parent of value change
        onChange(newValue);
        // Validate the new value and update error state if needed
        const { error: validationError } = validateEmail(newValue);
        setError(validationError);
    };

  return (
    <div>
      <TextField title={title} value={value} onChange={handleChange} {...rest} />
      {error && <div className="validation-error-text">{error}</div>}
    </div>
  );
};

export default EmailTextField;