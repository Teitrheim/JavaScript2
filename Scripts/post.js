// post.js
import { fetchPostById } from "./api.js";
import { API_COMMENTS_URL } from "./common.js";

async function displaySinglePost() {
  console.log("DisplaySinglePost function called");
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get("postId");
  console.log("Post ID from URL:", postId);
  if (postId) {
    try {
      console.log("Fetching post by ID:", postId);
      const post = await fetchPostById(postId);
      console.log("Post fetched successfully:", post);
      renderPost(post);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  } else {
    console.log("No Post ID found in URL");
  }
}

function renderPost(post) {
  const container = document.getElementById("single-post-container");
  container.classList.add("container", "mt-4");
  // Create a new div element
  const postContent = document.createElement("div");
  postContent.className = "card";
  postContent.innerHTML = `
  <div class="card-body">
    <h5 class="card-title">${post.title}</h5>
    ${
      post.media
        ? `<img src="${post.media}" class="img-fluid" alt="Post Image">`
        : ""
    }
    <p class="card-text mt-3">${post.body}</p>
  </div>
`;

  container.appendChild(postContent);
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event fired");
  displaySinglePost();
});

let likes = 0;
let dislikes = 0;

const likeButton = document.querySelector(".like-button");
const dislikeButton = document.querySelector(".dislike-button");

likeButton.addEventListener("click", () => {
  likes++;
  console.log("Like button clicked, current likes:", likes);
  updateLikesDislikes();
});

dislikeButton.addEventListener("click", () => {
  dislikes++;
  console.log("Dislike button clicked, current dislikes:", dislikes);
  updateLikesDislikes();
});

function updateLikesDislikes() {
  const likesElement = document.querySelector(".likes");
  const dislikesElement = document.querySelector(".dislikes");

  if (likesElement && dislikesElement) {
    likesElement.textContent = `Likes: ${likes}`;
    dislikesElement.textContent = `Dislikes: ${dislikes}`;
  } else {
    console.error("Like/Dislike elements not found");
  }
}

document
  .getElementById("comment-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const commentText = document.getElementById("comment-text").value;
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("postId");

    try {
      const response = await fetch(API_COMMENTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
        body: JSON.stringify({ postId, body: commentText }),
      });

      if (response.ok) {
        const newComment = await response.json();
        displayComment(newComment);
        document.getElementById("comment-text").value = "";
      } else {
        // Handle errors
        console.error("Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  });

function displayComment(comment) {
  const commentsContainer = document.getElementById("comments-container");
  const commentElement = document.createElement("div");
  commentElement.className = "comment";
  commentElement.innerHTML = `
    <p>${comment.body}</p>
    <!-- Add more details about the comment here -->
  `;
  commentsContainer.appendChild(commentElement);
}
async function submitComment(postId, commentBody) {
  const token = localStorage.getItem("jwtToken");
  try {
    const response = await fetch(
      `https://api.noroff.dev/api/v1/social/posts/${postId}/comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ body: commentBody }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to submit comment:", errorData.message);
      throw new Error("Failed to submit comment: " + response.statusText);
    }

    const newComment = await response.json();
    console.log("Comment submitted:", newComment);
  } catch (error) {
    console.error("Failed to submit comment", error);
  }
}

// Event listener for the comment submission
document
  .querySelector("#comment-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const commentInput = document.querySelector("#comment-text");
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get("postId");
    console.log("Submitting comment for post ID:", postId);
    if (commentInput.value.trim() && postId) {
      await submitComment(postId, commentInput.value.trim());
      commentInput.value = "";
    } else {
      console.error("Post ID or comment text is missing");
    }
  });
