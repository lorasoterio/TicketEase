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
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      suffix: data.suffix,
      strandId: data.strandId,
      gradeLevelId: data.gradeLevelId,
      isGraduate: data.isGraduate,
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
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      suffix: data.suffix,
      position: data.position,
      role: data.role,
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
  try {
    const response = await client.post("/auth/login", {
      email: data.email,
      password: data.password,
    });
    return response.data;
  } catch (err) {
    const message = err?.response?.data?.message || "Login failed.";
    throw new Error(message);
  }
};

export const fetchStrands = async () => {
  const response = await client.get("/Strand");
  return response.data;
};

export const fetchGradeLevels = async () => {
  const response = await client.get("/GradeLevel");
  return response.data;
};
