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
  if (!form.fullName.trim()) errors.fullName = "Full name is required.";
  if (!form.studentId.trim()) errors.studentId = "Student ID is required.";
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
      console.log("Submitting form:", form);
      console.log("Signup triggered");
      const validationErrors = validate(form);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setLoading(true);
      setServerError("");

      // Step 1: Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            student_id: form.studentId,
            role: "student",
          },
        },
      });

      if (signUpError) {
        console.error(
          "❌ Step 1 Failed — Auth signup error:",
          signUpError.message,
        );
        setServerError(signUpError.message);
        setLoading(false);
        return;
      }

      console.log("✅ Step 1 Success — Auth user created:", data.user.id);
      console.log("Full user object:", data.user);

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
        
      if (!sessionData?.session) {
        console.warn("No active session after signup.");
      }
      console.log("Session after signup:", sessionData);
      if (sessionError) console.error("Session error:", sessionError);

      setLoading(false);
      navigate("/login");
    } catch (err) {
      console.error("Unexpected error during registration:", err);
      setServerError("Something went wrong. Please try again.");
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
