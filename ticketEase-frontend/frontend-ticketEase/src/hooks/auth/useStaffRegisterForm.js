import { useState } from "react";
import { registerStaff } from "../../services/authServices";

const INITIAL_FIELDS = {
  firstName:"",
  lastName: "",
  middleName: "",
  suffix: "",
  position: "",
  role: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function validate(form) {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = "First name is required.";
  if (!form.lastName.trim()) errors.lastName = "Last name is required.";
  if (!form.middleName.trim()) errors.middleName = "Middle name is required.";
  if (!form.position.trim()) errors.position = "Position is required.";
  if (!form.role) errors.role = "Role is required.";
  if (!form.email.trim()) errors.email = "Email is required.";
  if (!form.password) errors.password = "Password is required.";
  else if (form.password.length < 6)
    errors.password = "Password must be at least 6 characters.";
  if (form.password !== form.confirmPassword)
    errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export function useStaffRegisterForm() {
  const [form, setForm] = useState(INITIAL_FIELDS);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleRegister = async () => {
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setServerError("");
      setSuccess(false);

      await registerStaff(form);

      setSuccess(true);
      setForm(INITIAL_FIELDS);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Something went wrong. Please try again.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    serverError,
    success,
    loading,
    handleChange,
    handleRegister,
  };
}
