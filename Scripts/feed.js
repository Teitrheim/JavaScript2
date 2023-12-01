import { fetchPosts } from "./api.js";
import { logout } from "./auth.js";

document.getElementById("logout-button").addEventListener("click", () => {
  logout();
});

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) {
    window.location.href = "../";
    return;
  }
  try {
    const posts = await fetchPosts();
    displayPosts(posts);
  } catch (error) {
    console.error("Error while fetching posts:", error);
  }
});

function displayPosts(posts) {
  const postFeed = document.getElementById("post-feed");
  postFeed.innerHTML = "";

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "post";
    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.body}</p>
      <hr>
    `;
    postFeed.appendChild(postElement);
  });
}