// form.js

import { createPost } from "./api.js";

// Function to create a new post
async function createNewPost() {
  const titleInput = document.getElementById("new-post-title");
  const bodyInput = document.getElementById("new-post-body");
  const mediaInput = document.getElementById("new-post-media");
  const successMessage = document.getElementById("success-message");

  const title = titleInput ? titleInput.value : "";
  const body = bodyInput ? bodyInput.value : "";
  const media = mediaInput ? mediaInput.value : "";

  try {
    const newPost = await createPost(title, body, media);

    // Display success message
    const successMessage = document.getElementById("post-success-message");
    if (successMessage) {
      successMessage.classList.remove("d-none"); // Show the success message
    }

    // Clear input fields
    titleInput.value = "";
    bodyInput.value = "";
    mediaInput.value = "";
  } catch (error) {
    console.error("Error creating new post:", error);
  }
}

function clearForm() {
  // Select the form elements by their IDs or any other selector
  const titleInput = document.getElementById("new-post-title");
  const bodyInput = document.getElementById("new-post-body");
  const mediaInput = document.getElementById("new-post-media");

  // Clear their values
  if (titleInput) titleInput.value = "";
  if (bodyInput) bodyInput.value = "";
  if (mediaInput) mediaInput.value = "";
}

// Event listener for creating a new post when the form is submitted
document.addEventListener("DOMContentLoaded", () => {
  const createPostForm = document.getElementById("create-post-form");
  if (createPostForm) {
    createPostForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      await createNewPost();
    });
  }

  // Event listener to navigate to the "createPosts.html" page.
  const createPostLink = document.getElementById("create-post-link");
  if (createPostLink) {
    createPostLink.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "/createPosts.html";
    });
  }
});
