document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("registerForm");
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("regEmail").value;
    if (validateEmail(email)) {
      console.log("Valid Email, proceed with registration");
    } else {
      alert(
        "Invalid Email. Please use @noroff.no or @stud.noroff.no email addresses."
      );
    }
  });
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+$/;
  return (
    re.test(email) &&
    (email.endsWith("@noroff.no") || email.endsWith("@stud.noroff.no"))
  );
}
