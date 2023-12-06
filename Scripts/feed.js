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
      console.log(posts);

      // Add event listener for filter input
      const filterInput = document.getElementById("filter-input");
      if (filterInput) {
        filterInput.addEventListener("input", () => {
          const filterText = filterInput.value.toLowerCase();
          const filteredPosts = posts.filter((post) => {
            const title = post.title ? post.title.toLowerCase() : "";
            const body = post.body ? post.body.toLowerCase() : "";
            return title.includes(filterText) || body.includes(filterText);
          });
          displayPosts(filteredPosts);
        });
      } else {
        console.error("Filter input element not found.");
      }
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
    if (post && post.title && (post.body || post.media)) {
      const postElement = document.createElement("div");
      postElement.className = "card mb-3";

      let mediaHtml = post.media
        ? `<img src="${post.media}" class="card-img-top">`
        : "";
      let authorHtml =
        post.author && post.author.avatar
          ? `<img src="${post.author.avatar}" class="author-avatar">`
          : "";

      postElement.innerHTML = `
        <div class="card-body" onclick="redirectToPost('${
          post.id
        }')" style="cursor: pointer;">
          <h5 class="card-title">${post.title}</h5>
          ${authorHtml}
          <p class="card-text">${post.body ? post.body : ""}</p>
          ${mediaHtml}
        </div>
      `;

      postElement.onclick = () => {
        window.location.href = `/singlePost/post.html?postId=${post.id}`;
      };

      postFeed.appendChild(postElement);
    }
  });
}

function displayPost(post) {
  const postFeed = document.getElementById("post-feed");
  postFeed.innerHTML = `
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">${post.title}</h5>
        <p class="card-text">${post.body}</p>
        ${post.media ? `<img src="${post.media}" class="card-img-top">` : ""}
      </div>
    </div>
  `;
}
