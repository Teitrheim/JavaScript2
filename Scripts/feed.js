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
    // Check if post data is valid before creating the element
    if (post && post.title && post.body) {
      const postElement = document.createElement("div");
      postElement.className = "card mb-3";
      postElement.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${post.body}</p>
        </div>
      `;
      postFeed.appendChild(postElement);
    }
  });
}
