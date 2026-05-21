import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authServices";

const INITIAL_FIELDS = {
  firstName: "",
  lastName: "",
  middleName: "",
  suffix: "",
  schoolStudentId: "",
  courseProgram: "",
  yearLevel: "",
  contactNumber: "",
  address: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function validate(form) {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = "First name is required.";
  if (!form.lastName.trim()) errors.lastName = "Last name is required.";
  if (!form.middleName.trim()) errors.middleName = "Middle name is required.";
  if (!form.schoolStudentId.trim()) errors.schoolStudentId = "Student ID is required.";
  if (!form.courseProgram.trim()) errors.courseProgram = "Course/Program is required.";
  if (!form.yearLevel.trim()) errors.yearLevel = "Year level is required.";
  if (!form.contactNumber.trim()) errors.contactNumber = "Contact number is required.";
  if (!form.address.trim()) errors.address = "Address is required.";
  if (!form.email.trim()) errors.email = "Email is required.";
  if (!form.password) errors.password = "Password is required.";
  else if (form.password.length < 6)
    errors.password = "Password must be at least 6 characters.";
  if (form.password !== form.confirmPassword)
    errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export function useRegisterForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FIELDS);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleRegister = async () => {
    try {
      const validationErrors = validate(form);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setLoading(true);
      setServerError("");

      await registerUser(form);

      setLoading(false);
      navigate("/login");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Something went wrong. Please try again.";
      setServerError(message);
      setLoading(false);
    }
  };

  return {
    form,
    errors,
    serverError,
    loading,
    handleChange,
    handleRegister,
  };
}
