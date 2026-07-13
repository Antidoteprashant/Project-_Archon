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