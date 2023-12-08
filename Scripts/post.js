// post.js
import { fetchPostById } from "./api.js";
import { API_POSTS_URL } from "./common.js";
import { API_BASE_URL } from "./common.js";

async function displaySinglePost() {
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("postId");
  if (postId) {
    try {
      const post = await fetchPostById(postId);
      renderPost(post);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  }
}

function renderPost(post) {
  const container = document.getElementById("single-post-container");
  container.classList.add("container", "mt-4");
  container.innerHTML = "";

  const postContent = document.createElement("div");
  postContent.className = "card";

  let authorHtml = "";
  if (post.author && post.author.avatar) {
    authorHtml = `<img src="${post.author.avatar}" class="author-avatar" alt="Author's Avatar">`;
  } else if (post.author) {
    authorHtml = `<p class="author-name">${post.author.name}</p>`;
  }

  let mediaHtml = post.media
    ? `<img src="${post.media}" class="img-fluid" alt="Post Image">`
    : "";

  postContent.innerHTML = `
    <div class="card-body">
      ${authorHtml}
      <h5 class="card-title">${post.title}</h5>
      ${mediaHtml}
      <p class="card-text mt-3">${post.body}</p>
    </div>
    <!-- Add the delete button here with data-post-id attribute -->
    <button class="btn btn-danger delete-button" data-post-id="${post.id}">
      <i class="fas fa-trash"></i> Delete
    </button>
  </div>
  `;

  // Event listener for delete buttons
  document.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-button")) {
      const postId = event.target.dataset.postId;

      // DELETE request to the API
      try {
        const deletedPostResponse = await deletePost(postId);
        if (deletedPostResponse && deletedPostResponse.status === 204) {
          removePostFromUI(postId);
        } else {
          console.error(
            "Failed to delete post:",
            deletedPostResponse.statusText
          );
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  });

  async function deletePost(postId) {
    const token = localStorage.getItem("jwtToken");
    try {
      const response = await fetch(`${API_POSTS_URL}/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        // Unauthorized
        alert("You are not authorized to delete this post.");
        return null;
      }

      return response;
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }

  function removePostFromUI(postId) {
    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    if (postElement) {
      postElement.remove();
    }
  }
  container.appendChild(postContent);

  const likeDislikeSection = document.createElement("div");
  likeDislikeSection.className = "like-dislike-buttons my-3";
  likeDislikeSection.innerHTML = `
    <button class="btn btn-success like-button">Like</button>
    <button class="btn btn-danger dislike-button">Dislike</button>
    <span class="likes">Likes: 0</span>
    <span class="dislikes">Dislikes: 0</span>
  `;
  container.appendChild(likeDislikeSection);

  const commentSection = document.createElement("div");
  commentSection.id = "comment-section";
  commentSection.innerHTML = `
    <form id="comment-form">
      <textarea id="comment-text" placeholder="Write your comment here..." required></textarea>
      <button type="submit" class="btn btn-success like-button">Submit Comment</button>
    </form>
    <div id="comments-container">
      <!-- Comments will be displayed here -->
    </div>
  `;
  container.appendChild(commentSection);
}

document.addEventListener("DOMContentLoaded", displaySinglePost);

let likes = 0;
let dislikes = 0;

document.addEventListener("DOMContentLoaded", () => {
  const likeButton = document.querySelector(".like-button");
  const dislikeButton = document.querySelector(".dislike-button");

  likeButton.addEventListener("click", () => {
    likes++;
    updateLikesDislikes();
  });

  dislikeButton.addEventListener("click", () => {
    dislikes++;
    updateLikesDislikes();
  });

  function updateLikesDislikes() {
    const likesElement = document.querySelector(".likes");
    const dislikesElement = document.querySelector(".dislikes");

    if (likesElement && dislikesElement) {
      likesElement.textContent = `Likes: ${likes}`;
      dislikesElement.textContent = `Dislikes: ${dislikes}`;
    }
  }

  const commentForm = document.getElementById("comment-form");
  commentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const commentText = document.getElementById("comment-text").value;
    const postId = new URLSearchParams(window.location.search).get("postId");

    if (commentText.trim() && postId) {
      submitComment(postId, commentText.trim());
      document.getElementById("comment-text").value = "";
    }
  });
});

async function submitComment(postId, commentBody) {
  const token = localStorage.getItem("jwtToken");
  try {
    const response = await fetch(`${API_COMMENTS_URL}${postId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ body: commentBody }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit comment: " + response.statusText);
    }

    const newComment = await response.json();
    displayComment(newComment);
  } catch (error) {
    console.error("Failed to submit comment", error);
  }
}

function displayComment(comment) {
  const commentsContainer = document.getElementById("comments-container");
  const commentElement = document.createElement("div");
  commentElement.className = "comment";
  commentElement.innerHTML = `<p>${comment.body}</p>`;
  commentsContainer.appendChild(commentElement);
}
