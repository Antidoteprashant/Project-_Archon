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
// Contact Form
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const firstName = document.getElementById("firstName").value.trim();
        const lastName = document.getElementById("lastName").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value;
        const message = document.getElementById("message").value.trim();

        // Check if required fields are empty
        if (!firstName || !lastName || !email || !message) {
            alert("Please fill in all required fields.");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        // Disable button while submitting
        const submitButton = contactForm.querySelector("button[type='submit']");
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        // Simulate form submission
        setTimeout(() => {
            alert("Message sent successfully!");

            contactForm.reset();

            submitButton.disabled = false;
            submitButton.textContent = "Send Message";
        }, 1000);
    });
}

// Global Offices Map
const officeCards = document.querySelectorAll(".office-card");
const officeMap = document.getElementById("officeMap");
const googleMapsLink = document.getElementById("googleMapsLink");

const officeLocations = {
    london: {
        map: "https://www.google.com/maps?q=Canary+Wharf+London&output=embed",
        link: "https://maps.google.com/?q=Canary+Wharf+London"
    },
    newyork: {
        map: "https://www.google.com/maps?q=Wall+Street+New+York&output=embed",
        link: "https://maps.google.com/?q=Wall+Street+New+York"
    },
    singapore: {
        map: "https://www.google.com/maps?q=Marina+Bay+Financial+Centre+Singapore&output=embed",
        link: "https://maps.google.com/?q=Marina+Bay+Financial+Centre+Singapore"
    }
};

if (officeMap && googleMapsLink) {
    officeCards.forEach(card => {
        card.addEventListener("click", () => {
            const office = card.dataset.office;

            officeMap.src = officeLocations[office].map;
            googleMapsLink.href = officeLocations[office].link;

            officeCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
        });
    });
}