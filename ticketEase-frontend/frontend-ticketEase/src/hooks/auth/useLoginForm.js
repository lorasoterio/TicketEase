import { useState } from "react";
import { useNavigate } from "react-router-dom";


const INITIAL_FIELDS = {
  email: "",
  password: "",
};

function validate(form) {
  const errors = {};
  if (!form.email.trim()) errors.email = "Email is required.";
  if (!form.password)     errors.password = "Password is required.";
  return errors;
}

export function useLoginForm() {
  const navigate = useNavigate();
  const [form, setForm]               = useState(INITIAL_FIELDS);
  const [errors, setErrors]           = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]         = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleLogin = async () => {
    // 1. Validate fields
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError("");

    // 2. Sign in with Supabase
    /*
    const { error } = await supabase.auth.signInWithPassword({
      email:    form.email,
      password: form.password,
    });

    if (error) {
      setServerError(error.message);
      setLoading(false);
      return;
    }
      */

    setLoading(false);
    navigate("/request-ticket");
  };

  return {
    form,
    errors,
    serverError,
    loading,
    handleChange,
    handleLogin,
  };
}