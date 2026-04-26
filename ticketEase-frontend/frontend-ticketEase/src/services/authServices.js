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
 * Register new staff/admin user (two-step: create auth user, then staff profile)
 */
export const registerStaff = async (data) => {
  // Step 1: Create auth user with Staff or Admin role
  const authResponse = await client.post("/auth/register", {
    Email: data.email,
    Password: data.password,
    Role: data.role,
  });

  const userId = authResponse.data.userId;

  // Step 2: Create staff profile
  await client.post("/staff", {
    UserId: userId,
    FullName: data.fullName,
    Position: data.position,
    Department: data.department,
    ContactNumber: data.contactNumber,
    IsActive: true,
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
