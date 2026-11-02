document.documentElement.classList.add("js");

// Add Mohamed's LinkedIn URL here when he provides it.
const linkedinProfileUrl = "";

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const navigationLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    navigation.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    navigation.classList.toggle("is-open", !isOpen);
});

navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        menuToggle.focus();
    }
});

const setHeaderState = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navigationLinks.forEach((link) => {
                const isActive = link.getAttribute("href") === `#${entry.target.id}`;
                link.classList.toggle("is-active", isActive);
                if (isActive) link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
            });
        });
    }, { rootMargin: "-25% 0px -65% 0px", threshold: 0 });

    sections.forEach((section) => sectionObserver.observe(section));
} else {
    document.querySelectorAll(".reveal").forEach((item) => item.classList.add("is-visible"));
}

const typingText = document.querySelector(".typing-text");
const jobTitles = ["Full Stack Developer", "Frontend Developer", "Web Developer", "Creative Coder"];

if (!reducedMotion.matches && typingText) {
    let titleIndex = 0;
    let letterIndex = jobTitles[0].length;
    let deleting = true;

    const typeNextTitle = () => {
        const title = jobTitles[titleIndex];
        letterIndex += deleting ? -1 : 1;
        typingText.textContent = title.slice(0, letterIndex);

        if (deleting && letterIndex === 0) {
            deleting = false;
            titleIndex = (titleIndex + 1) % jobTitles.length;
            window.setTimeout(typeNextTitle, 350);
            return;
        }

        if (!deleting && letterIndex === jobTitles[titleIndex].length) {
            deleting = true;
            window.setTimeout(typeNextTitle, 1550);
            return;
        }

        window.setTimeout(typeNextTitle, deleting ? 38 : 72);
    };

    window.setTimeout(typeNextTitle, 1850);
}

const linkedinLink = document.querySelector(".linkedin-link");
const linkedinNote = document.querySelector(".linkedin-note");

if (linkedinProfileUrl.startsWith("https://www.linkedin.com/")) {
    linkedinLink.href = linkedinProfileUrl;
    linkedinLink.target = "_blank";
    linkedinLink.rel = "noopener noreferrer";
    linkedinLink.hidden = false;
    linkedinLink.setAttribute("aria-label", "LinkedIn profile for Mohamed Rahim");
    linkedinNote.hidden = true;
}

const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector("#form-feedback");

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formFeedback.classList.remove("is-error", "is-ready");

    if (!contactForm.reportValidity()) {
        formFeedback.textContent = "Please check the required fields and enter a valid email address.";
        formFeedback.classList.add("is-error");
        return;
    }

    const formData = new FormData(contactForm);
    const senderName = formData.get("name").toString().trim();
    const senderEmail = formData.get("email").toString().trim();
    const subject = formData.get("subject").toString().trim();
    const message = formData.get("message").toString().trim();
    const body = `From: ${senderName}\nReply to: ${senderEmail}\n\n${message}`;
    const emailUrl = `mailto:dev.ma.mohamad@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    formFeedback.textContent = "Opening your email app with this message. The website itself does not send or store messages.";
    formFeedback.classList.add("is-ready");
    window.location.href = emailUrl;
});

contactForm.addEventListener("input", () => {
    formFeedback.classList.remove("is-error", "is-ready");
    formFeedback.textContent = "This form opens your email app; it does not send messages from this website.";
});
