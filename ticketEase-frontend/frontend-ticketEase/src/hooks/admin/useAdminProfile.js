import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
import client from "../../api/client";

export default function useAdminProfile() {
  const { profile: authProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  useEffect(() => {
    if (!authProfile?.userId) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const { data } = await client.get(`/staff/user/${authProfile.userId}`);
        setProfile(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    })();
  }, [authProfile?.userId]);

  function updatePasswordField(name, value) {
    setPasswordError(null);
    setPasswordSuccess(false);
    setPasswords((p) => ({ ...p, [name]: value }));
  }

  function changePassword() {
    if (!passwords.current) {
      setPasswordError("Current password is required.");
      return;
    }
    if (passwords.newPass.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setPasswordError("Passwords do not match.");
      return;
    }

    // future API call here
    setPasswordSuccess(true);
    setPasswords({ current: "", newPass: "", confirm: "" });
  }

  return {
    profile,
    loading,
    error,
    passwords,
    passwordError,
    passwordSuccess,
    updatePasswordField,
    changePassword,
  };
}
