import client from "../api/client";

/**
 * Register new student user (two-step: create auth user, then student profile)
 */
export const registerUser = async (data) => {
  try {
    const response = await client.post("/auth/register/student", {
      email: data.email,
      password: data.password,
      schoolStudentId: data.schoolStudentId,
      fullName: data.fullName,
      courseProgram: data.courseProgram,
      yearLevel: data.yearLevel,
      contactNumber: data.contactNumber,
      address: data.address,
    });
    return response.data;
  } catch (err) {
    // Forward backend error message if present
    const message = err?.response?.data?.message || "Registration failed.";
    throw new Error(message);
  }
};

/**
 * Register new staff/admin user (two-step: create auth user, then staff profile)
 */
export const registerStaff = async (data) => {
  try {
    const response = await client.post("/auth/register/staff", {
      email: data.email,
      password: data.password,
      fullName: data.fullName,
      position: data.position,
      department: data.department,
      contactNumber: data.contactNumber,
    });
    return response.data;
  } catch (err) {
    // Forward backend error message if present
    const message = err?.response?.data?.message || "Registration failed.";
    throw new Error(message);
  }
};

/**
 * Login user
 */
export const loginUser = async (data) => {
  const response = await client.post("/auth/login", {
    Email: data.email,
    Password: data.password,
  });

  return response.data;
};
