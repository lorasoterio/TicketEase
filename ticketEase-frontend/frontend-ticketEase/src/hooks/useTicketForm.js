import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { submitTicket } from "../services/ticketsService";
import { getStudentByUserId } from "../services/studentService";

/**
 * useTicketForm — A reusable custom hook for any ticket submission form.
 *
 * HOW TO USE IN ANY PAGE:
 *   const { form, errors, submitted, ticketNumber, handleChange, handleSubmit, handleReset }
 *     = useTicketForm(initialFields, validationRules, onSuccess);
 *
 * @param {Object} initialFields   - The initial empty state of your form fields.
 * @param {Function} validateFn    - A function that receives the form and returns an errors object.
 * @param {Function} [onSuccess]   - Optional callback invoked immediately after a successful submission.
 */
export function useTicketForm(initialFields, validateFn, onSuccess) {
  const { user } = useAuth();
  const [form, setForm] = useState(initialFields);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);

  // Fetch the student profile and auto-fill school ID and full name
  useEffect(() => {
    if (!user?.userId) return;
    getStudentByUserId(user.userId).then(({ data }) => {
      if (!data) return;
      setStudentProfile(data);
      setForm((prev) => ({
        ...prev,
        studentId: data.schoolStudentId ?? prev.studentId,
        fullName: data.fullName ?? prev.fullName,
      }));
    });
  }, [user?.userId]);

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
      StudentId: user.userId,
      TicketType: 0, // 0 = DocumentRequest
      Subject: form.subject,
      Description: form.description,
      Priority: 0, // 0 = Normal
    };

    const { data, error } = await submitTicket(ticketData);

    setLoading(false);
    if (error) { setErrors({ submit: "Failed to submit. Please try again." }); return; }
    setTicketNumber(data.referenceNumber);
    setSubmitted(true);
    if (typeof onSuccess === "function") onSuccess();
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
    studentProfile,
    handleChange,
    handleSubmit,
    handleReset,
  };
}
