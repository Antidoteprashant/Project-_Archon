
const overlay = document.querySelector(".overlay");
const authContainer = document.querySelector(".auth-container");
// Target the password input specifically by its id from register.html
const passInput = document.querySelector("#password");
const passGroup = passInput ? passInput.closest('.form-group') : null;
let errorMessage = null;


if (overlay) {
    overlay.addEventListener("click", () => {
    overlay.classList.add("hidden");
    window.location.href = "index.html";
});
}



if (authContainer) {
    authContainer.addEventListener("click", (event) => {
    event.stopPropagation();
});
}


//add an event listener that listens to the input that the user types in the password field and checks if the password is strong or not, and generate an error message if the password is weak.

if (passInput) {
    passInput.addEventListener("input", () => {
        const password = passInput.value;
        const isWeak = password.length < 8 || !/[!@#$%^&*]/.test(password) || !/[A-Z]/.test(password);

        if (!errorMessage && passGroup) {
            errorMessage = document.createElement("p");
            errorMessage.classList.add("error-message");
            errorMessage.style.color = "red";
            errorMessage.style.marginTop = "8px";
            passGroup.appendChild(errorMessage);
        }

        if (isWeak && errorMessage) {
            errorMessage.textContent = "This password is weak, please input a strong password.";
            errorMessage.style.display = "block";
        } else if (errorMessage) {
            errorMessage.textContent = "";
            errorMessage.style.display = "none";
        }
    });
}

// Pricing toggle functionality
const billingToggleInput = document.querySelector(".billing-toggle input[type='checkbox']");
if (billingToggleInput) {
    const billingLabels = document.querySelectorAll(".billing-toggle .billing-label");
    const prices = document.querySelectorAll(".pricing-card__price");
    const periods = document.querySelectorAll(".pricing-card__period");

    const pricingData = {
        annual: {
            prices: ["0", "29", "99"],
            periods: ["Forever free", "per month, billed annually", "per month, billed annually"]
        },
        monthly: {
            prices: ["0", "35", "119"],
            periods: ["Forever free", "per month, billed monthly", "per month, billed monthly"]
        }
    };

    const updatePricing = () => {
        const isAnnual = billingToggleInput.checked;
        const data = isAnnual ? pricingData.annual : pricingData.monthly;

        if (billingLabels.length >= 2) {
            billingLabels[0].classList.toggle("active", !isAnnual);
            billingLabels[1].classList.toggle("active", isAnnual);
        }

        prices.forEach((el, index) => {
            if (data.prices[index] !== undefined) {
                el.textContent = data.prices[index];
            }
        });

        periods.forEach((el, index) => {
            if (data.periods[index] !== undefined) {
                el.textContent = data.periods[index];
            }
        });
    };

    billingToggleInput.addEventListener("change", updatePricing);

    if (billingLabels.length >= 2) {
        billingLabels[0].style.cursor = "pointer";
        billingLabels[1].style.cursor = "pointer";
        billingLabels[0].addEventListener("click", () => {
            if (billingToggleInput.checked) {
                billingToggleInput.checked = false;
                updatePricing();
            }
        });
        billingLabels[1].addEventListener("click", () => {
            if (!billingToggleInput.checked) {
                billingToggleInput.checked = true;
                updatePricing();
            }
        });
    }
}
document.addEventListener("DOMContentLoaded", function () {
    var isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) return;

    document.querySelectorAll(".nav__actions, .nav__mobile-actions").forEach(function (container) {
        container.innerHTML = '<a href="#" class="btn btn-primary" id="navLogoutBtn">Log Out</a>';
    });

    document.querySelectorAll("#navLogoutBtn").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            localStorage.removeItem("isLoggedIn");
            localStorage.removeItem("currentUserEmail");
            window.location.href = "index.html";
        });
    });
});

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


