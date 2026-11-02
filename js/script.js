document.documentElement.classList.add("js");

// Add Mohamed's LinkedIn URL here when he provides it.
const linkedinProfileUrl = "";
const themeToggle = document.querySelector(".theme-toggle");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
    const isLight = theme === "light";
    document.body.dataset.theme = isLight ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${isLight ? "dark" : "light"} mode`);
    themeToggle.title = `Switch to ${isLight ? "dark" : "light"} mode`;
    themeToggle.querySelector(".theme-label").textContent = `${isLight ? "Dark" : "Light"} mode`;
    themeColorMeta.content = isLight ? "#f3f7ff" : "#080b14";
}

try {
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme === "light" || savedTheme === "dark") applyTheme(savedTheme);
} catch (error) {
    console.warn("The saved theme preference could not be restored.", error);
}

themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);

    try {
        localStorage.setItem("portfolio-theme", nextTheme);
    } catch (error) {
        console.warn("The theme preference could not be saved.", error);
    }

    if (window.matchMedia("(max-width: 760px)").matches) closeMenu();
});

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const navigationLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function startIntro() {
    const intro = document.querySelector("#page-intro");
    const canvas = intro.querySelector(".snow-canvas");

    if (reducedMotion.matches) {
        intro.remove();
        return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
        intro.remove();
        document.body.classList.add("intro-complete");
        return;
    }

    intro.hidden = false;
    let width = 0;
    let height = 0;
    const pixelRatio = 1;

    const resizeCanvas = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    const particleCount = Math.min(30, Math.max(12, Math.round(width / 48)));
    let introFinished = false;
    let lastRenderTime = 0;
    const flakeImage = document.createElement("canvas");
    flakeImage.width = 32;
    flakeImage.height = 32;
    const flakeContext = flakeImage.getContext("2d");
    flakeContext.strokeStyle = "#d3eeff";
    flakeContext.lineWidth = 1.5;
    flakeContext.lineCap = "round";
    for (let arm = 0; arm < 6; arm += 1) {
        const angle = arm * Math.PI / 3;
        const endX = 16 + Math.cos(angle) * 11;
        const endY = 16 + Math.sin(angle) * 11;
        const branchX = 16 + Math.cos(angle) * 6.5;
        const branchY = 16 + Math.sin(angle) * 6.5;
        const branchLength = 3.5;
        flakeContext.beginPath();
        flakeContext.moveTo(16, 16);
        flakeContext.lineTo(endX, endY);
        flakeContext.moveTo(branchX, branchY);
        flakeContext.lineTo(branchX - Math.cos(angle - .72) * branchLength, branchY - Math.sin(angle - .72) * branchLength);
        flakeContext.moveTo(branchX, branchY);
        flakeContext.lineTo(branchX - Math.cos(angle + .72) * branchLength, branchY - Math.sin(angle + .72) * branchLength);
        flakeContext.stroke();
    }

    const snowflakes = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 5 + 9,
        speed: Math.random() * .8 + .45,
        drift: (Math.random() - .5) * .55,
        phase: Math.random() * Math.PI * 2,
        opacity: Math.random() * .42 + .28,
        twist: Math.random() * .6 + .2
    }));

    const renderSnow = (timestamp) => {
        if (timestamp - lastRenderTime < 33) {
            window.requestAnimationFrame(renderSnow);
            return;
        }
        const frameScale = lastRenderTime ? Math.min((timestamp - lastRenderTime) / 16.67, 2) : 1;
        lastRenderTime = timestamp;
        const time = timestamp * .001;
        context.clearRect(0, 0, width, height);

        snowflakes.forEach((flake) => {
            const fallProgress = flake.y / height;
            const approach = introFinished ? 0 : Math.max(0, Math.min(1, (fallProgress - .08) / .64));
            const easeToCenter = approach * approach * (3 - 2 * approach);
            const targetX = width * .5 + Math.sin(flake.phase + time * .8) * (18 + flake.size * 1.6);
            const naturalDrift = Math.sin(time + flake.phase) * flake.twist;

            flake.x += (naturalDrift + flake.drift + (targetX - flake.x) * easeToCenter * .012) * frameScale;
            flake.y += flake.speed * (1 + easeToCenter * .3) * frameScale;

            const nearCenter = Math.max(0, 1 - Math.abs(flake.x - width * .5) / Math.max(width * .32, 1));
            const opacity = flake.opacity * (1 - approach * .45) * (.58 + nearCenter * .42);
            context.globalAlpha = opacity;
            context.drawImage(flakeImage, flake.x - flake.size / 2, flake.y - flake.size / 2, flake.size, flake.size);
            context.globalAlpha = 1;

            if (flake.y > height + 12 || flake.x < -12 || flake.x > width + 12) {
                flake.x = Math.random() * width;
                flake.y = -Math.random() * height * .32;
                flake.phase = Math.random() * Math.PI * 2;
            }
        });

        window.requestAnimationFrame(renderSnow);
    };

    const finishIntro = () => {
        if (introFinished) return;
        introFinished = true;
        canvas.classList.add("background-snow");
        document.body.appendChild(canvas);
        intro.classList.add("is-leaving");

        window.setTimeout(() => {
            intro.remove();
            document.body.classList.add("intro-complete");
        }, 1100);
    };

    window.requestAnimationFrame(renderSnow);
    window.setTimeout(finishIntro, 2450);
}

startIntro();

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
