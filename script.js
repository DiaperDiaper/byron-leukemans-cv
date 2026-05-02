const progress = document.querySelector(".scroll-progress");
const revealTargets = document.querySelectorAll(".reveal, .stagger");
const counters = document.querySelectorAll("[data-count]");
const typedLabels = document.querySelectorAll(".section-label");
const navLinks = document.querySelectorAll(".nav-links a");
const navSections = [...navLinks]
  .map((link) => {
    const href = link.getAttribute("href") || "";
    return href.startsWith("#") ? document.querySelector(href) : null;
  })
  .filter(Boolean);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

typedLabels.forEach((label) => {
  const text = label.textContent.trim();
  label.dataset.typeText = text;
  label.setAttribute("aria-label", text);
  label.classList.add("typing-label");

  if (!reducedMotion) {
    label.textContent = "";
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      if (entry.target.classList.contains("section-label")) {
        typeSectionLabel(entry.target);
      }
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
);

revealTargets.forEach((target) => revealObserver.observe(target));

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.done) return;
      entry.target.dataset.done = "true";
      animateCount(entry.target, Number(entry.target.dataset.count));
    });
  },
  { threshold: 0.55 }
);

counters.forEach((counter) => countObserver.observe(counter));

function animateCount(node, target) {
  if (reducedMotion) {
    node.textContent = formatCount(target);
    return;
  }

  const start = performance.now();
  const duration = 1200;

  function tick(now) {
    const progressAmount = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progressAmount, 4);
    node.textContent = formatCount(Math.round(target * eased));

    if (progressAmount < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function formatCount(value) {
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  return String(value);
}

function typeSectionLabel(label) {
  const text = label.dataset.typeText || "";

  if (reducedMotion || label.dataset.typed === "true") {
    label.textContent = text;
    label.dataset.typed = "true";
    return;
  }

  label.dataset.typed = "true";
  label.classList.add("is-typing");

  let index = 0;
  const speed = 42;
  const startDelay = 140;

  window.setTimeout(() => {
    const write = () => {
      label.textContent = text.slice(0, index);
      index += 1;

      if (index <= text.length) {
        window.setTimeout(write, speed);
        return;
      }

      label.classList.remove("is-typing");
      label.classList.add("typed");
    };

    write();
  }, startDelay);
}

function updateProgress() {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const amount = max > 0 ? window.scrollY / max : 0;
  progress.style.width = `${amount * 100}%`;
}

function updateNav() {
  const activeSection = [...navSections].reverse().find((section) => {
    return section.getBoundingClientRect().top <= 84;
  });

  navLinks.forEach((link) => {
    link.classList.toggle(
      "is-active",
      Boolean(activeSection && link.getAttribute("href") === `#${activeSection.id}`)
    );
  });
}

window.addEventListener(
  "scroll",
  () => {
    updateProgress();
    updateNav();
    updateTypedLabels();
  },
  { passive: true }
);

updateProgress();
updateNav();
updateTypedLabels();

function updateTypedLabels() {
  typedLabels.forEach((label) => {
    if (label.dataset.typed === "true") return;

    const rect = label.getBoundingClientRect();
    const triggerLine = window.innerHeight * 0.88;
    const isApproaching = rect.top <= triggerLine && rect.bottom >= 0;

    if (!isApproaching) return;
    label.classList.add("visible");
    typeSectionLabel(label);
  });
}

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (reducedMotion) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    card.style.setProperty("--tilt-y", `${x * 5}deg`);
    card.style.setProperty("--tilt-x", `${-y * 5}deg`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });
});

document.querySelectorAll(".btn, .writing-card, .contact-card, .nav-cv").forEach((item) => {
  item.addEventListener("click", (event) => {
    if (reducedMotion) return;

    const rect = item.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    item.appendChild(ripple);

    window.setTimeout(() => ripple.remove(), 540);
  });
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    const text = target?.innerText?.trim();

    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      const original = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => {
        button.textContent = original;
      }, 1400);
    } catch {
      button.textContent = "Select citation";
    }
  });
});
