// form.js

import { createPost } from "./api.js";

// Function to create a new post
async function createNewPost() {
  const titleInput = document.getElementById("new-post-title");
  const bodyInput = document.getElementById("new-post-body");
  const mediaInput = document.getElementById("new-post-media");

  const title = titleInput ? titleInput.value : "";
  const body = bodyInput ? bodyInput.value : "";
  const media = mediaInput ? mediaInput.value : "";

  try {
    const newPost = await createPost(title, body, media);
    console.log("New post created:", newPost);
    titleInput.value = "";
    bodyInput.value = "";
    mediaInput.value = "";
  } catch (error) {
    console.error("Error creating new post:", error);
  }
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
