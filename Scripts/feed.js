import { fetchPosts } from "./api.js";
import { logout } from "./auth.js";

document.getElementById("logout-button").addEventListener("click", () => {
  console.log("Page Loaded");
  logout();
});

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const view = urlParams.get("view");
  const postId = urlParams.get("postId");
  console.log("View:", view, "Post ID:", postId);
  if (view === "post" && postId) {
    try {
      console.log("Fetching post by ID:", postId);
      const post = await fetchPostById(postId);
      displayPost(post);
    } catch (error) {
      console.error("Error fetching specific post:", error);
    }
  } else {
    try {
      console.log("Fetching all posts");
      const posts = await fetchPosts();
      displayPosts(posts);
    } catch (error) {
      console.error("Error while fetching posts:", error);
    }
  }
});

function displayPosts(posts) {
  const postFeed = document.getElementById("post-feed");
  postFeed.innerHTML = "";

  posts.forEach((post) => {
    if (post && post.title && post.body) {
      const postElement = document.createElement("div");
      postElement.className = "card mb-3";
      let mediaHtml = post.media
        ? `<img src="${post.media}" class="card-img-top">`
        : "";
      postElement.innerHTML = `
        ${mediaHtml}
        <div class="card-body" onclick="location.href='/feed?postId=${post.id}'" style="cursor: pointer;">
          <h5 class="card-title">${post.title}</h5>
          <p class="card-text">${post.body}</p>
        </div>
      `;
      postFeed.appendChild(postElement);
    }
  });
}

async function fetchPostById(postId) {
  const token = localStorage.getItem("jwtToken");
  try {
    const response = await fetch(
      `https://api.noroff.dev/api/v1/social/posts/${postId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch post: " + response.statusText);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching post by ID:", error);
    throw error;
  }
}

function displayPost(post) {
  const postFeed = document.getElementById("post-feed");
  let mediaHtml = post.media
    ? `<img src="${post.media}" class="card-img-top">`
    : "";
  postFeed.innerHTML = `
    ${mediaHtml}
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">${post.title}</h5>
        <p class="card-text">${post.body}</p>
      </div>
    </div>
  `;
}
