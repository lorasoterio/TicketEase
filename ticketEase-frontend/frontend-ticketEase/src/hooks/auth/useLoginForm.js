import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authServices";

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

    try {
      const data = await loginUser(form);

      localStorage.setItem("user", JSON.stringify(data));

      const role = data.role?.toLowerCase();
      if (role === "staff" || role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "superadmin") {
        navigate("/super-admin/dashboard");
      } else {
        navigate("/user/request-ticket");
      }
    } catch (err) {
      setServerError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
