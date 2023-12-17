import { fetchPosts } from "./api.js";

async function displayUserProfile() {
  const userId = getCurrentUserId();
  if (userId) {
    try {
      const allPosts = await fetchPosts(userId);
      const userPosts = allPosts.filter(
        (post) => post.author && post.author.id === userId
      );
      renderPosts(userPosts);
    } catch (error) {
      console.error("Error fetching user's posts:", error);
    }
  } else {
    console.error("User ID is null or undefined.");
  }
}

function renderPosts(posts) {
  const postsContainer = document.getElementById("user-posts-section");

  posts.forEach((post) => {
    const postElement = createPostElement(post);
    postsContainer.appendChild(postElement);
  });
}

function createPostElement(post) {
  const article = document.createElement("article");
  article.className =
    "post-article mb-4 p-4 bg-white border shadow border rounded";

  const header = document.createElement("header");
  header.className = "d-flex justify-content-between mb-2";

  const authorDiv = document.createElement("div");
  authorDiv.className = "d-flex align-items-center";

  const authorImg = document.createElement("img");
  authorImg.src = post.author.avatar || "/path/to/default/avatar.png"; // Replace with default avatar if not present
  authorImg.alt = "User Avatar";
  authorImg.className = "rounded-circle mr-2";
  authorImg.width = 40;
  authorImg.height = 40;
  authorDiv.appendChild(authorImg);

  const authorName = document.createElement("h2");
  authorName.className = "mb-0";
  authorName.textContent = post.author.name;
  authorDiv.appendChild(authorName);

  header.appendChild(authorDiv);

  const authorEmail = document.createElement("small");
  authorEmail.textContent = post.author.email;
  header.appendChild(authorEmail);

  article.appendChild(header);

  const postContent = document.createElement("p");
  postContent.className = "mb-2";
  postContent.textContent = post.body;
  article.appendChild(postContent);

  const footer = document.createElement("footer");
  footer.className = "d-flex justify-content-between";

  const likesSpan = document.createElement("span");
  likesSpan.textContent = `${post.likes} likes`;
  footer.appendChild(likesSpan);

  const commentsSpan = document.createElement("span");
  commentsSpan.textContent = `${post.comments.length} comments`;
  footer.appendChild(commentsSpan);

  article.appendChild(footer);

  return article;
}

function getCurrentUserId() {
  const urlParams = new URLSearchParams(window.location.search);
  const userIdFromUrl = urlParams.get("userId");
  const userIdFromStorage = localStorage.getItem("currentUserId");

  return userIdFromUrl || userIdFromStorage;
}
document.addEventListener("DOMContentLoaded", displayUserProfile);
