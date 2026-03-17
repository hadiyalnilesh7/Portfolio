// SCROLL PROGRESS BAR
const scrollProgress = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = (scrollTop / scrollHeight) * 100;
  scrollProgress.style.width = progress + "%";
});

// NAVBAR — scrolled clas
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ========================================
// MOBILE MENU TOGGLE
// ========================================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navLinks.classList.toggle("active");
  document.body.style.overflow = navLinks.classList.contains("active") ? "hidden" : "";
});

// Close menu on link click
document.querySelectorAll(".nav-link, .btn-nav").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// Close menu on outside click
document.addEventListener("click", (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains("active")) {
    menuToggle.classList.remove("active");
    navLinks.classList.remove("active");
    document.body.style.overflow = "";
  }
});

// ========================================
// TYPEWRITER EFFECT
// ========================================
const typewriterEl = document.getElementById("typewriter");
const phrases = [
  "scalable web apps.",
  "clean REST APIs.",
  "robust backends.",
  "MERN stack apps.",
  "real-world solutions.",
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

function typeWriter() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typingSpeed = 45;
  } else {
    typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typingSpeed = 80;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    typingSpeed = 1800; // pause at end
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typingSpeed = 400; // pause before next phrase
  }

  setTimeout(typeWriter, typingSpeed);
}

// Start typewriter after a brief delay
setTimeout(typeWriter, 1200);

// ========================================
// SCROLL REVEAL
// ========================================
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
);

revealElements.forEach((el) => revealObserver.observe(el));

// ========================================
// SMOOTH SCROLL
// ========================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href === "#") return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = target.offsetTop - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  });
});

// ========================================
// ACTIVE NAV LINK HIGHLIGHT
// ========================================
const sections = document.querySelectorAll("section[id]");
const navLinkEls = document.querySelectorAll(".nav-link");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinkEls.forEach((link) => {
          link.style.color = "";
          if (link.getAttribute("href") === `#${id}`) {
            link.style.color = "var(--accent-3)";
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((section) => sectionObserver.observe(section));

// ========================================
// CONTACT FORM
// ========================================
const contactForm = document.getElementById("contactForm");
const submitBtn = document.getElementById("submit-btn");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const subject = document.getElementById("subject").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    showToast("Please fill in all required fields.", "error");
    return;
  }

  // Send to FormSubmit endpoint configured on the form action.
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        _subject: "New Portfolio Contact Message",
        _captcha: "false",
        _template: "table",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit contact form");
    }

    submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
    showToast("Thank you! Your message was sent.", "success");
    contactForm.reset();
  } catch (error) {
    showToast("Message failed to send. Please email me directly.", "error");
  } finally {
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
    }, 1200);
  }
});

// ========================================
// TOAST NOTIFICATION
// ========================================
function showToast(message, type = "success") {
  // Remove existing toast
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}"></i>
    <span>${message}</span>
  `;

  // Toast styles
  Object.assign(toast.style, {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    background: type === "success" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
    border: `1px solid ${type === "success" ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}`,
    color: type === "success" ? "#34d399" : "#f87171",
    padding: "1rem 1.5rem",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "0.9rem",
    fontWeight: "600",
    backdropFilter: "blur(12px)",
    zIndex: "9999",
    boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    transform: "translateY(20px)",
    opacity: "0",
    transition: "all 0.3s ease",
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    Object.assign(toast.style, {
      transform: "translateY(0)",
      opacity: "1",
    });
  });

  setTimeout(() => {
    Object.assign(toast.style, {
      transform: "translateY(20px)",
      opacity: "0",
    });
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ========================================
// CUSTOM CURSOR EFFECT
// ========================================
(function initCursor() {
  // Only on non-touch devices
  if (window.matchMedia("(pointer: coarse)").matches) return;

  // Create cursor elements
  const dot  = document.createElement("div");
  const ring = document.createElement("div");
  dot.className  = "cursor-dot";
  ring.className = "cursor-ring";
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let isHovering = false;
  let isClicking = false;

  // Move dot instantly; ring follows with lerp
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  // Smooth ring follow via requestAnimationFrame
  function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover on interactive elements — expand ring
  const hoverTargets = "a, button, input, textarea, .project-card, .skill-box, .skill-item, .contact-method, .nav-link, .btn, .btn-nav, .social-icon, .footer-social";

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverTargets)) {
      isHovering = true;
      dot.classList.add("cursor-dot--hover");
      ring.classList.add("cursor-ring--hover");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverTargets)) {
      isHovering = false;
      dot.classList.remove("cursor-dot--hover");
      ring.classList.remove("cursor-ring--hover");
    }
  });

  // Click burst
  document.addEventListener("mousedown", () => {
    dot.classList.add("cursor-dot--click");
    ring.classList.add("cursor-ring--click");
  });

  document.addEventListener("mouseup", () => {
    dot.classList.remove("cursor-dot--click");
    ring.classList.remove("cursor-ring--click");

    // Ripple on click
    const ripple = document.createElement("div");
    ripple.className = "cursor-ripple";
    ripple.style.left = mouseX + "px";
    ripple.style.top  = mouseY + "px";
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });

  // Hide cursor when leaving window
  document.addEventListener("mouseleave", () => {
    dot.style.opacity  = "0";
    ring.style.opacity = "0";
  });
  document.addEventListener("mouseenter", () => {
    dot.style.opacity  = "1";
    ring.style.opacity = "1";
  });
})();
