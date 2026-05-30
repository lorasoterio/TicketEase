import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authServices";
import { getStrands } from "../../services/strandService";
import { getGradeLevels } from "../../services/gradeLevelService";

const INITIAL_FIELDS = {
  firstName: "",
  lastName: "",
  middleName: "",
  suffix: "",
  schoolStudentId: "",
  strandId: "",
  gradeLevelId: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function validate(form) {
  const errors = {};
  if (!form.firstName.trim()) errors.firstName = "First name is required.";
  if (!form.lastName.trim()) errors.lastName = "Last name is required.";
  if (!form.middleName.trim()) errors.middleName = "Middle name is required.";
  if (!form.schoolStudentId.trim())
    errors.schoolStudentId = "Student ID is required.";
  if (!form.strandId.trim()) errors.strandId = "Strand is required.";
  if (!form.gradeLevelId.trim()) errors.gradeLevelId = "Grade level is required.";
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
  const [strands, setStrands] = useState([]);
  const [strandsLoading, setStrandsLoading] = useState(false);
  const [strandsError, setStrandsError] = useState("");
  const [gradeLevels, setGradeLevels] = useState([]);
  const [gradeLevelsLoading, setGradeLevelsLoading] = useState(false);
  const [gradeLevelsError, setGradeLevelsError] = useState("");
  // Fetch strands for dropdown
  useEffect(() => {
    const fetchStrands = async () => {
      setStrandsLoading(true);
      setStrandsError("");
      try {
        const data = await getStrands();
        setStrands(data);
      } catch (err) {
        setStrandsError("Failed to load strands.");
      } finally {
        setStrandsLoading(false);
      }
    };
    fetchStrands();
  }, []);

    useEffect(() => {
    const fetchGradeLevels = async () => {
      setGradeLevelsLoading(true);
      setGradeLevelsError("");
      try {
        const data = await getGradeLevels();
        setGradeLevels(data);
      } catch (err) {
        setGradeLevelError("Failed to load grade levels.");
      } finally {
        setGradeLevelLoading(false);
      }
    };
    fetchGradeLevels();
  }, []);

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
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
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
    strands,
    strandsLoading,
    strandsError,
    gradeLevels,
    gradeLevelsLoading,
    gradeLevelsError,
    fetchGradeLevels,
    fetchStrands,
  };
}
