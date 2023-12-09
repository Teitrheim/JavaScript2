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
<button class="btn btn-danger btn-sm delete-button" data-post-id="${post.id}">
<i class="fa-solid fa-trash-can"></i> Delete
</button>
  `;
  container.appendChild(postContent);

  attachDeleteListener();
  // Add Like and Dislike buttons
  addLikeDislikeSection(container);
  // Comment Section
  createCommentSection(container, post.id);
}

// Function to add like and dislike section
function addLikeDislikeSection(container) {
  let likes = 0;
  let dislikes = 0;

  const likeDislikeSection = document.createElement("div");
  likeDislikeSection.className = "like-dislike-buttons my-3";
  likeDislikeSection.innerHTML = `
      <button class="btn btn-success like-button">Like</button>
      <button class="btn btn-danger dislike-button">Dislike</button>
      <span class="likes">Likes: ${likes}</span>
      <span class="dislikes">Dislikes: ${dislikes}</span>
  `;
  container.appendChild(likeDislikeSection);

  const likeButton = likeDislikeSection.querySelector(".like-button");
  const dislikeButton = likeDislikeSection.querySelector(".dislike-button");
  const likesElement = likeDislikeSection.querySelector(".likes");
  const dislikesElement = likeDislikeSection.querySelector(".dislikes");

  likeButton.addEventListener("click", () => {
    likes++;
    updateLikesDislikes(likesElement, dislikesElement, likes, dislikes);
  });

  dislikeButton.addEventListener("click", () => {
    dislikes++;
    updateLikesDislikes(likesElement, dislikesElement, likes, dislikes);
  });
}

// Function to update likes and dislikes counts
function updateLikesDislikes(likesElement, dislikesElement, likes, dislikes) {
  likesElement.textContent = `Likes: ${likes}`;
  dislikesElement.textContent = `Dislikes: ${dislikes}`;
}

// Listener for the delete button
function attachDeleteListener() {
  const deleteButton = document.querySelector(".delete-button");
  if (deleteButton) {
    deleteButton.addEventListener("click", async (event) => {
      const postId = event.target.dataset.postId;
      try {
        const deletedPostResponse = await deletePost(postId);
        if (deletedPostResponse.success) {
          removePostFromUI(postId);
        } else {
          console.error(
            "Failed to delete post:",
            deletedPostResponse.error || "Unknown error"
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
      return { success: true };
    } else if (response.status === 401) {
      // Unauthorized
      alert("You are not authorized to delete this post.");
      return { error: "Unauthorized" };
    } else if (response.status === 404) {
      // Not found
      alert("Post not found. It may have already been deleted.");
      return { error: "Not Found" };
    } else {
      // Other errors
      alert("An error occurred while trying to delete the post.");
      return { error: "Other Error", status: response.status };
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    return { error: error.message || "Network Error" };
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
