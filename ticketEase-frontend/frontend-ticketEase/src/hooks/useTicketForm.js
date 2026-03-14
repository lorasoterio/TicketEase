import { useState } from "react";
import { generateTicketNumber } from "../utils/ticketHelpers";

/**
 * useTicketForm — A reusable custom hook for any ticket submission form.
 *
 * HOW TO USE IN ANY PAGE:
 *   const { form, errors, submitted, ticketNumber, handleChange, handleSubmit, handleReset }
 *     = useTicketForm(initialFields, validationRules);
 *
 * @param {Object} initialFields   - The initial empty state of your form fields.
 * @param {Function} validateFn    - A function that receives the form and returns an errors object.
 * @param {string} ticketPrefix    - Prefix for the generated ticket number (e.g. "REG", "IT", "LIB").
 */
export function useTicketForm(initialFields, validateFn, ticketPrefix = "TKT") {
  const [form, setForm] = useState(initialFields);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  /**
   * handleChange — Returns a change handler for a specific field.
   * Usage in JSX: onChange={handleChange("fieldName")}
   */
  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear the error for this field as soon as the user starts typing
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  /**
   * handleSubmit — Runs validation. If valid, generates a ticket number and marks as submitted.
   */
  const handleSubmit = () => {
    const validationErrors = validateFn(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const ticket = generateTicketNumber(ticketPrefix);
    setTicketNumber(ticket);
    setSubmitted(true);
  };

  /**
   * handleReset — Clears everything back to the initial state.
   */
  const handleReset = () => {
    setForm(initialFields);
    setErrors({});
    setSubmitted(false);
    setTicketNumber("");
  };

  return {
    form,
    errors,
    submitted,
    ticketNumber,
    handleChange,
    handleSubmit,
    handleReset,
  };
}
