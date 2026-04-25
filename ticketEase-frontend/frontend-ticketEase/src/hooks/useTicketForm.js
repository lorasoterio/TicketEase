import { useState } from "react";
import { useAuth } from "../context/useAuth"; // 👈 add this
import { submitTicket } from "../services/ticketsService"; // 👈 add this import

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
export function useTicketForm(initialFields, validateFn) {
   const { user } = useAuth();
  const [form, setForm] = useState(initialFields);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [loading, setLoading] = useState(false); // 👈 add this

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
  const handleSubmit = async () => {
    const validationErrors = validateFn(form);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }

    setLoading(true);

    const ticketData = {
      student_id: user.id,
      full_name: form.fullName,
      category: "document_request",
      subject: form.subject,
      description: form.description,
      document_type: form.documentType,
      priority: "normal",
    };

    const { data, error } = await submitTicket(ticketData);

    setLoading(false);
    if (error) { setErrors({ submit: "Failed to submit. Please try again." }); return; }
    setTicketNumber(data.ticket_number);
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
    loading,
    handleChange,
    handleSubmit,
    handleReset,
  };
}
