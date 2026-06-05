import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authServices";
import { useAuth } from "../../context/useAuth";

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
  const { setUser, setProfile } = useAuth();
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

      const normalizedRole = (data.role ?? data.Role ?? "").toString().toLowerCase();
      const normalizedIsVerified = data.isVerified ?? data.IsVerified;
      if (normalizedRole === "student" && normalizedIsVerified !== true) {
        setServerError("Your student account is pending verification.");
        return;
      }

      const normalizedUser = {
        ...data,
        role: data.role ?? data.Role,
        isVerified: normalizedIsVerified,
      };

      sessionStorage.setItem("user", JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      setProfile(normalizedUser);

      if (normalizedRole === "staff" || normalizedRole === "admin") {
        navigate("/admin/dashboard");
      } else if (normalizedRole === "superadmin") {
        navigate("/superadmin/dashboard");
      } else {
        navigate("/user/dashboard");
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
