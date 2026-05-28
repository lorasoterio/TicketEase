import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { submitTicket } from "../services/ticketsService";
import { getStudentByUserId } from "../services/studentService";
import { createAuditLog } from "../services/auditLogService";
import { fetchDocumentTypes } from "../services/documentTypeService";

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
  const [documentTypes, setDocumentTypes] = useState([]);
  // Fetch document types when ticket type is 'Document Request'
  useEffect(() => {
    if (form.ticketType === "Document Request") {
      fetchDocumentTypes().then((data) => {
        setDocumentTypes(Array.isArray(data) ? data : []);
      });
    } else {
      setDocumentTypes([]);
    }
  }, [form.ticketType]);

  // Fetch the student profile and auto-fill school ID and full name
  useEffect(() => {
    if (!user?.userId) return;
    getStudentByUserId(user.userId).then(({ data }) => {
      if (!data) return;
      setStudentProfile(data);
      setForm((prev) => ({
        ...prev,
        studentId: data.schoolStudentId ?? prev.studentId,
        fullName:
          [data.firstName, data.middleName, data.lastName]
            .filter(Boolean)
            .join(" ") || prev.fullName,
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
    if (!studentProfile) {
      setErrors({ submit: "Student profile not loaded yet. Please wait." });
      return;
    }
    const validationErrors = validateFn(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    const ticketTypeMap = { "Document Request": 0, Inquiry: 1 };

    const ticketData = {
      StudentId: studentProfile?.studentId,
      TicketType: ticketTypeMap[form.ticketType] ?? 0,
      Subject: form.subject,
      Description: form.description,
      Priority: 0,
      ...(form.ticketType === "Document Request" && {
        DocumentTypeId: form.documentTypeId ?? null, // ← add this
      }),
    };

    const { data, error } = await submitTicket(ticketData);

    setLoading(false);
    if (error) {
      setErrors({ submit: "Failed to submit. Please try again." });
      return;
    }
    setTicketNumber(data.referenceNumber);
    setSubmitted(true);
    createAuditLog({
      userId: user?.userId ?? null,
      actionType: "TICKET_SUBMITTED",
      entityType: "Ticket",
      entityId: data.ticketId ?? null,
      oldValues: null,
      newValues: {
        referenceNumber: data.referenceNumber,
        ticketType: form.ticketType,
        subject: form.subject,
      },
    });
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
    documentTypes,
    handleChange,
    handleSubmit,
    handleReset,
  };
}
