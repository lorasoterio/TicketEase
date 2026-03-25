import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

const INITIAL_FIELDS = {
  fullName: "",
  studentId: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function validate(form) {
  const errors = {};
  if (!form.fullName.trim())        errors.fullName = "Full name is required.";
  if (!form.studentId.trim())       errors.studentId = "Student ID is required.";
  if (!form.email.trim())           errors.email = "Email is required.";
  if (!form.password)               errors.password = "Password is required.";
  else if (form.password.length < 6) errors.password = "Password must be at least 6 characters.";
  if (form.password !== form.confirmPassword) errors.confirmPassword = "Passwords do not match.";
  return errors;
}

export function useRegisterForm() {
  const navigate = useNavigate();
  const [form, setForm]             = useState(INITIAL_FIELDS);
  const [errors, setErrors]         = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]       = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleRegister = async () => {
    // 1. Validate fields
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError("");

    // 2. Create auth user in Supabase
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name:  form.fullName,
          student_id: form.studentId,
          role:       "student",
        },
      },
    });

    if (signUpError) {
      setServerError(signUpError.message);
      setLoading(false);
      return;
    }

    // 3. Insert row into profiles table
    const { error: profileError } = await supabase.from("profiles").insert({
      id:         data.user.id,
      full_name:  form.fullName,
      email:      form.email,
      role:       "student",
      student_id: form.studentId,
    });

    if (profileError) {
      setServerError(profileError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    navigate("/login");
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