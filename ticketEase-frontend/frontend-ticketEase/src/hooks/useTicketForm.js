import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { submitTicket } from "../services/ticketsService";


async function fetchStudentByUserId(userId) {
  try {
    const res = await fetch(`/api/student/user/${userId}`);
    if (!res.ok) {
      console.error(`[fetchStudentByUserId] HTTP ${res.status} for userId=${userId}`);
      throw new Error("Failed to fetch student info");
    }
    const student = await res.json();
    return student;
  } catch (e) {
    console.error("[fetchStudentByUserId] Error fetching student:", e);
    return null;
  }
}

// Maps the display category string to the TicketType enum integer value
// Backend enum: DocumentRequest=0, Inquiry=1
function mapTicketType(documentType) {
  if (documentType === "Inquiry") return 1; // = Inquiry
  return 0; // = DocumentRequest 
}

/**
 * useTicketForm — A reusable custom hook for any ticket submission form.
 *
 * HOW TO USE IN ANY PAGE:
 *   const { form, updateForm, errors, submitted, ticketNumber, handleChange, handleSubmit, handleReset }
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
  const [loading, setLoading] = useState(false);


  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };


  const handleSubmit = async () => {
    console.log("[useTicketForm] handleSubmit triggered");

    // Only use AuthContext for userId
    const userId = user?.userId;
    if (!userId) {
      console.warn("[useTicketForm] handleSubmit: No authenticated user found.", { user });
      setErrors({ submit: "User not authenticated." });
      return;
    }

    setLoading(true);
    // Fetch student record linked to this user
    const studentData = await fetchStudentByUserId(userId);
    setLoading(false);
    if (!studentData) {
      console.error("[useTicketForm] handleSubmit: Student record missing.", { userId });
      setErrors({ submit: "Student record not found." });
      return;
    }

    const updatedForm = {
      ...form,
      studentId: studentData.schoolStudentId,  // school-issued student ID (display only)
      fullName: studentData.fullName,
    };
    setForm(updatedForm);

    const validationErrors = validateFn(updatedForm);
    if (Object.keys(validationErrors).length > 0) {
      console.warn("[useTicketForm] handleSubmit: Validation failed.", validationErrors);
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    // Ticket.StudentId is FK to User.UserId (not Student.StudentId)
    const ticketData = {
      studentId: updatedForm.studentId,
      ticketType: mapTicketType(form.documentType),  // 0 = DocumentRequest, 1 = Inquiry
      subject: form.subject,
      description: form.description,
      priority: 0,  // 0 = Normal (enum integer)
    };

    console.log("[useTicketForm] Submitting ticket with data:", ticketData);
    const { data, error } = await submitTicket(ticketData);

    setLoading(false);
    if (error) {
      console.error("[useTicketForm] handleSubmit: submitTicket failed.", error);
      setErrors({ submit: "Failed to submit. Please try again." });
      return;
    }
    // Backend returns the Ticket object; reference number is in `referenceNumber`
    setTicketNumber(data.referenceNumber);
    setSubmitted(true);
    console.log("[useTicketForm] Ticket submitted successfully. Reference number:", data.referenceNumber);
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
