// post.js
import { fetchPostById } from "./api.js";

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
