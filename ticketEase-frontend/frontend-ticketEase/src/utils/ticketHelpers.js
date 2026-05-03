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

export const TICKET_CATEGORIES = [
  "Inquiry",
  "Document Request",
  "Other",
];

export const TICKET_TYPES = [
  "Document Request",
  "Inquiry",
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
  if (!form.ticketType)
    errors.ticketType = "Please select a ticket type.";
  if (!form.subject?.trim())
    errors.subject = "Subject is required.";
  if (!form.description?.trim())
    errors.description = "Description is required.";
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
