import { API_BASE_URL } from "./common.js";

export async function fetchPosts() {
  const token = localStorage.getItem("jwtToken");
  try {
    const response = await fetch(`${API_BASE_URL}/social/posts?_author=true`, {
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

export async function fetchPostById(postId) {
  const token = localStorage.getItem("jwtToken");
  try {
    const response = await fetch(`${API_BASE_URL}/social/posts/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch post: " + response.statusText);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
}

export async function createPost(title, body, media) {
  const token = localStorage.getItem("jwtToken");
  const payload = {
    title,
    body,
    media,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/social/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create post: " + response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}
