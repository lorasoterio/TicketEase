import client from "../api/client";

/**
 * Register new student user (two-step: create auth user, then student profile)
 */
export const registerUser = async (data) => {
  // Step 1: Create auth user
  const authResponse = await client.post("/auth/register", {
    Email: data.email,
    Password: data.password,
    Role: "Student",
  });

  const userId = authResponse.data.userId;

  // Step 2: Create student profile
  await client.post("/student", {
    UserId: userId,
    SchoolStudentId: data.schoolStudentId,
    FullName: data.fullName,
    CourseProgram: data.courseProgram,
    YearLevel: data.yearLevel,
    ContactNumber: data.contactNumber,
    Address: data.address,
  });

  return authResponse.data;
};

/**
 * Login user
 */
export const loginUser = async (data) => {
  const response = await client.post("/auth/login", {
    email: data.email,
    password: data.password,
  });

  return response.data;
};
