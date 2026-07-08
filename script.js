const overlay = document.querySelector(".overlay");
const authContainer = document.querySelector(".auth-container");

overlay.addEventListener("click", () => {
    overlay.classList.add("hidden");
    window.location.href = "index.html";
});

authContainer.addEventListener("click", (event) => {
    event.stopPropagation();
});
document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.querySelector(".newsletter-form__input");
  const subscribeBtn = document.querySelector(".newsletter-form__row .btn-primary");

  if (subscribeBtn && emailInput) {
    subscribeBtn.addEventListener("click", () => {
      const emailValue = emailInput.value.trim();

      if (emailValue === "") {
        alert("Please enter your email address!");
        return;
      }

      if (!emailValue.includes("@") || !emailValue.includes(".")) {
        alert("Please enter a valid email address!");
        return;
      }

      alert("Thanks for subscribing! Stay ahead of the market. 🚀");
      emailInput.value = "";
    });
  }
