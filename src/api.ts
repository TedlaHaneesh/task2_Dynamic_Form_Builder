import { User, FormResponse } from "./types";

const API_BASE_URL = "https://dynamic-form-generator-9rl7.onrender.com";

export const createUser = async (
  userData: User
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return {
      success: response.ok,
      message: data.message || "User created successfully",
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: "Failed to create user. Please try again.",
    };
  }
};

export const getForm = async (
  rollNumber: string
): Promise<FormResponse | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/get-form?rollNumber=${rollNumber}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch form");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching form:", error);
    return null;
  }
};
