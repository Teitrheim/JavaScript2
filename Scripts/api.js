import { API_BASE_URL } from "./common.js";

export async function fetchPosts() {
  const token = localStorage.getItem("jwtToken");
  console.log("Token", token);
  try {
    const response = await fetch(`${API_BASE_URL}/social/posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    return response.json();
  } catch (error) {
    console.error("Fetch posts error:", error);
    throw error;
  }
}
