const overlay = document.querySelector(".overlay");
const authContainer = document.querySelector(".auth-container");

if (overlay && authContainer) {
    overlay.addEventListener("click", () => {
        overlay.classList.add("hidden");
        window.location.href = "index.html";
    });

    authContainer.addEventListener("click", (event) => {
        event.stopPropagation();
    });
}
// Newsletter Subscribe
const subscribeBtn = document.getElementById("subscribeBtn");
const newsletterEmail = document.getElementById("newsletterEmail");

if (subscribeBtn && newsletterEmail) {
    subscribeBtn.addEventListener("click", function () {
        const email = newsletterEmail.value.trim();

        if (email === "") {
            alert("Please enter your email.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        subscribeBtn.disabled = true;
        subscribeBtn.textContent = "Subscribing...";

        setTimeout(() => {
            alert("Thank you for subscribing!");

            newsletterEmail.value = "";

            subscribeBtn.disabled = false;
            subscribeBtn.textContent = "Subscribe";
        }, 1000);
    });
}