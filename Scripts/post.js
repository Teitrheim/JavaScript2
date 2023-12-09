// post.js
import { fetchPostById } from "./api.js";
import { API_POSTS_URL, API_BASE_URL } from "./common.js";

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
  // Rendering media and interaction with the delete button
  let authorHtml =
    post.author && post.author.avatar
      ? `<img src="${post.author.avatar}" class="author-avatar" alt="Author's Avatar">`
      : post.author
      ? `<p class="author-name">${post.author.name}</p>`
      : "";

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
    <button class="btn btn-danger delete-button" data-post-id="${post.id}">
      <i class="fas fa-trash"></i> Delete
    </button>
  `;
  container.appendChild(postContent);

  attachDeleteListener();

  // Comment Section
  createCommentSection(container, post.id);
}
// Listener for the delete button
function attachDeleteListener() {
  const deleteButton = document.querySelector(".delete-button");
  if (deleteButton) {
    deleteButton.addEventListener("click", async (event) => {
      const postId = event.target.dataset.postId;
      try {
        const deletedPostResponse = await deletePost(postId);
        if (deletedPostResponse && deletedPostResponse.status === 204) {
          removePostFromUI(postId);
        } else {
          console.error(
            "Failed to delete post:",
            deletedPostResponse
              ? deletedPostResponse.statusText
              : "Unknown error"
          );
        }
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    });
  }
}

async function deletePost(postId) {
  const token = localStorage.getItem("jwtToken");
  try {
    const response = await fetch(`${API_POSTS_URL}/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      // Successfully deleted
      return response;
    } else if (response.status === 401) {
      // Unauthorized
      alert("You are not authorized to delete this post.");
      return null;
    } else if (response.status === 404) {
      // Not found
      alert("Post not found. It may have already been deleted.");
      return null;
    } else {
      // Other errors
      alert("An error occurred while trying to delete the post.");
      return null;
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return null; // Return null or an object with a structure that you can handle later
  }
}

function removePostFromUI(postId) {
  const postElement = document.querySelector(`[data-post-id="${postId}"]`);
  if (postElement) {
    postElement.remove();
  }
}

function createCommentSection(container, postId) {
  const commentSection = document.createElement("div");
  commentSection.id = "comment-section";
  commentSection.innerHTML = `
    <form id="comment-form">
      <textarea id="comment-text" placeholder="Write your comment here..." required></textarea>
      <button type="submit" class="btn btn-success">Submit Comment</button>
    </form>
    <div id="comments-container">
      <!-- Comments will be displayed here -->
    </div>
  `;
  container.appendChild(commentSection);

  attachCommentListener(postId);
}

function attachCommentListener(postId) {
  const commentForm = document.getElementById("comment-form");
  if (commentForm) {
    commentForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const commentText = document.getElementById("comment-text").value;
      if (commentText.trim()) {
        await submitComment(postId, commentText.trim());
        document.getElementById("comment-text").value = "";
      }
    });
  }
}

async function submitComment(postId, commentBody) {
  const token = localStorage.getItem("jwtToken");
  try {
    const response = await fetch(
      `${API_BASE_URL}/social/posts/${postId}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: commentBody }),
      }
    );

    if (response.ok) {
      const newComment = await response.json();
      displayComment(newComment);
    } else {
      console.error("Failed to submit comment:", response.statusText);
    }
  } catch (error) {
    console.error("Error submitting comment:", error);
  }
}

function displayComment(comment) {
  const commentsContainer = document.getElementById("comments-container");
  const commentElement = document.createElement("div");
  commentElement.className = "comment";
  commentElement.innerHTML = `<p>${comment.body}</p>`;
  commentsContainer.appendChild(commentElement);
}

document.addEventListener("DOMContentLoaded", displaySinglePost);
