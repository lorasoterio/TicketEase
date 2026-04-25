import { useState } from "react";

/* mock profile */
const MOCK_PROFILE = {
  full_name: "Juan Dela Cruz",
  student_id: "2023-001245",
  department: "Computer Science",
  email: "juan@student.edu",
  phone: "+63 912 345 6789",
  photo: null,
};

export default function useProfile() {
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  function updatePhoto(file) {
    const preview = URL.createObjectURL(file);

    setProfile((p) => ({
      ...p,
      photo: preview,
    }));
  }

  function updatePasswordField(name, value) {
    setPasswords((p) => ({ ...p, [name]: value }));
  }

  function changePassword() {
    if (passwords.newPass !== passwords.confirm) {
      alert("Passwords do not match");
      return;
    }

    // future API call here
    alert("Password updated");

    setPasswords({
      current: "",
      newPass: "",
      confirm: "",
    });
  }

  return {
    profile,
    passwords,
    updatePhoto,
    updatePasswordField,
    changePassword,
  };
}