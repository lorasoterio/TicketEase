// ─────────────────────────────────────────────────────────────
// ticketHelpers.js — Pure utility functions and shared data.
// "Pure" means: no React, no state, no side effects.
// These can be imported anywhere: pages, hooks, tests, etc.
// ─────────────────────────────────────────────────────────────

// ── Ticket Number Generator ──────────────────────────────────
/**
 * Generates a unique ticket number with a given prefix.
 * Example: generateTicketNumber("REG") → "REG-483920"
 *
 * @param {string} prefix - Department or form prefix.
 * @returns {string} Formatted ticket number.
 */
export function generateTicketNumber(prefix = "TKT") {
  return `${prefix}-${Date.now().toString().slice(-6)}`;
}

// ── School Year Generator ─────────────────────────────────────
/**
 * Generates an array of school year strings going back `count` years.
 * Example: getSchoolYears(3) → ["2025–2026", "2024–2025", "2023–2024"]
 *
 * @param {number} count - How many years back to include.
 * @returns {string[]}
 */
export function getSchoolYears(count = 6) {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => {
    const y = currentYear - i;
    return `${y - 1}–${y}`;
  });
}

// ── Shared Dropdown Data ─────────────────────────────────────
// Keep all dropdown option lists here so they're not duplicated
// across multiple form pages.

export const DOCUMENT_TYPES = [
  "Transcript of Records (TOR)",
  "Certificate of Enrollment",
  "Certificate of Graduation",
  "Certificate of Good Moral Character",
  "Diploma",
  "Form 137 / SF9",
  "Official Receipt of Payment",
  "Authentication of Documents",
  "Course Description",
  "Other",
];

export const SEMESTERS = ["1st Semester", "2nd Semester", "Summer"];

export const PURPOSES = [
  "Employment / Job Application",
  "Graduate School Application",
  "Scholarship Application",
  "Educational Assistance",
  "Transfer to Another School",
  "Board Exam / Licensure",
  "Travel / Visa Application",
  "Personal Records",
  "Government Requirement",
  "Other",
];

// ── Validation Rules ─────────────────────────────────────────
// Each exported function validates a specific form.
// They all follow the same pattern:
//   receives the form object → returns an errors object.
// An empty errors object {} means the form is valid.

/**
 * Validates the Document Request form fields.
 * @param {Object} form
 * @returns {Object} errors
 */
export function validateDocumentRequest(form) {
  const errors = {};
  if (!form.studentId?.trim())
    errors.studentId = "Student ID is required.";
  if (!form.fullName?.trim())
    errors.fullName = "Full name is required.";
  if (!form.documentType)
    errors.documentType = "Please select a document type.";
  if (!form.semester)
    errors.semester = "Please select a semester.";
  if (!form.schoolYear)
    errors.schoolYear = "Please select a school year.";
  if (!form.purpose)
    errors.purpose = "Please select a purpose.";
  return errors;
}

/**
 * Validates a General Inquiry form (example for a second form type).
 * Add more validators here as you create new ticket forms.
 * @param {Object} form
 * @returns {Object} errors
 */
export function validateGeneralInquiry(form) {
  const errors = {};
  if (!form.studentId?.trim())
    errors.studentId = "Student ID is required.";
  if (!form.fullName?.trim())
    errors.fullName = "Full name is required.";
  if (!form.subject?.trim())
    errors.subject = "Subject is required.";
  if (!form.message?.trim())
    errors.message = "Please describe your concern.";
  return errors;
}
