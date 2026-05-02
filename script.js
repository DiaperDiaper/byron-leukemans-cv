const progress = document.querySelector(".scroll-progress");
const revealTargets = document.querySelectorAll(".reveal, .stagger");
const counters = document.querySelectorAll("[data-count]");
const typedLabels = document.querySelectorAll(".section-label");
const navLinks = document.querySelectorAll(".nav-links a");
const archiveSearch = document.querySelector("#archive-search");
const archiveModule = document.querySelector("#archive-module");
const archiveTopic = document.querySelector("#archive-topic");
const archiveFormat = document.querySelector("#archive-format");
const archiveClear = document.querySelector("#archive-clear");
const archiveResults = document.querySelector("#archive-results");
const archiveCount = document.querySelector("#archive-count");
const randomProjects = document.querySelector("#random-projects");
const navSections = [...navLinks]
  .map((link) => {
    const href = link.getAttribute("href") || "";
    return href.startsWith("#") ? document.querySelector(href) : null;
  })
  .filter(Boolean);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const researchProjects = [
  {
    id: "information-portals",
    title: "Implementing an Information Portal in the Growing Business Sector",
    module: "Information Portals 1A",
    topic: "Information systems",
    year: "2025",
    type: "DOCX",
    download: "assets/research/information-portals-1a-report.docx",
    blog: "blog/information-portals.html",
    summary:
      "A report on information portals as structured gateways for business content, access, security, integration, and decision-making.",
    keywords: [
      "information portals",
      "business growth",
      "content access",
      "security",
      "decision-making",
      "integration",
      "user access",
      "enterprise portals"
    ],
    citation:
      "Leukemans, B. (2025) Implementing an Information Portal in the Growing Business Sector. Unpublished first-year report. University of Johannesburg."
  },
  {
    id: "vericore",
    title: "VeriCore Technologies: Biometric Identity Verification Business Plan",
    module: "Information Management 1B",
    topic: "Business technology",
    year: "2025",
    type: "PDF",
    download: "assets/research/information-management-1b-vericore-business-plan.pdf",
    blog: "blog/vericore-identity-verification.html",
    summary:
      "A business plan for a secure identity-verification company focused on biometric verification, POPIA compliance, fraud prevention, and trust.",
    keywords: [
      "VeriCore",
      "biometric verification",
      "data protection",
      "POPIA",
      "fraud prevention",
      "secure identity",
      "compliance",
      "business plan"
    ],
    citation:
      "Leukemans, B. (2025) VeriCore Technologies: Biometric Identity Verification Business Plan. Unpublished first-year business plan. University of Johannesburg."
  },
  {
    id: "separation-of-powers",
    title: "Separation of Powers and Its Practice in South Africa",
    module: "Public Management and Governance 1A",
    topic: "Governance",
    year: "2025",
    type: "PDF",
    download: "assets/research/public-management-governance-1a-separation-powers.pdf",
    blog: "blog/separation-of-powers.html",
    summary:
      "A governance assignment on constitutional practice, executive authority, judiciary independence, legislative oversight, and checks and balances.",
    keywords: [
      "separation of powers",
      "South Africa",
      "constitution",
      "executive",
      "judiciary",
      "legislature",
      "checks and balances",
      "democracy"
    ],
    citation:
      "Leukemans, B. (2025) Separation of Powers and Its Practice in South Africa. Unpublished first-year assignment. University of Johannesburg."
  },
  {
    id: "green-economy",
    title: "Sustainable Development and the Green Economy in South Africa",
    module: "Public Management and Governance 1B",
    topic: "Sustainability",
    year: "2025",
    type: "DOCX",
    download: "assets/research/public-management-governance-1b-green-economy.docx",
    blog: "blog/green-economy.html",
    summary:
      "A policy assignment on South Africa's green economy, sustainable development, renewable energy, environmental strategy, and economic growth.",
    keywords: [
      "green economy",
      "sustainable development",
      "South Africa",
      "renewable energy",
      "policy strategy",
      "economic growth",
      "environmental policy",
      "sustainability"
    ],
    citation:
      "Leukemans, B. (2025) Sustainable Development and the Green Economy in South Africa. Unpublished first-year assignment. University of Johannesburg."
  }
];

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
renderArchive();
renderRandomProjects();

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

function renderArchive() {
  if (!archiveResults) return;

  const query = archiveSearch?.value?.trim().toLowerCase() || "";
  const selectedModule = archiveModule?.value || "";
  const selectedTopic = archiveTopic?.value || "";
  const selectedFormat = archiveFormat?.value || "";

  const results = researchProjects.filter((project) => {
    const searchable = [
      project.title,
      project.module,
      project.topic,
      project.year,
      project.type,
      project.summary,
      project.citation,
      ...project.keywords
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!query || searchable.includes(query)) &&
      (!selectedModule || project.module === selectedModule) &&
      (!selectedTopic || project.topic === selectedTopic) &&
      (!selectedFormat || project.type === selectedFormat)
    );
  });

  archiveResults.innerHTML = results.length
    ? results.map(createArchiveCard).join("")
    : `<article class="archive-card empty-state">
        <p class="card-label">No results</p>
        <h3>No reports match those filters.</h3>
        <p>Try a broader keyword, remove a filter, or use one of the keyword chips above.</p>
      </article>`;

  if (archiveCount) {
    archiveCount.textContent = `${results.length} ${results.length === 1 ? "report" : "reports"}`;
  }
}

function createArchiveCard(project) {
  const keywords = project.keywords
    .slice(0, 6)
    .map((keyword) => `<span class="tag">${keyword}</span>`)
    .join("");

  return `<article class="archive-card">
    <div class="archive-card-top">
      <p class="card-label">${project.module} · ${project.year} · ${project.type}</p>
      <span>${project.topic}</span>
    </div>
    <h3>${project.title}</h3>
    <p>${project.summary}</p>
    <div class="pub-tags">${keywords}</div>
    <div class="archive-citation" id="archive-cite-${project.id}">${project.citation}</div>
    <div class="archive-actions">
      <a class="btn btn-primary" href="${project.download}" download>Download</a>
      <a class="btn btn-ghost" href="${project.blog}">Read commentary</a>
      <button class="btn btn-ghost archive-copy" type="button" data-copy-text="${escapeAttribute(project.citation)}">Cite</button>
    </div>
  </article>`;
}

function renderRandomProjects() {
  if (!randomProjects) return;

  const picks = seededShuffle(researchProjects).slice(0, 5);
  randomProjects.innerHTML = picks
    .map(
      (project) => `<a class="random-project-card" href="${project.blog}">
        <span>${project.module}</span>
        <strong>${project.title}</strong>
        <small>${project.keywords.slice(0, 3).join(" · ")}</small>
      </a>`
    )
    .join("");
}

function seededShuffle(items) {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  return [...items]
    .map((item, index) => {
      const value = Math.sin(seed + index * 999) * 10000;
      return { item, sort: value - Math.floor(value) };
    })
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

[archiveSearch, archiveModule, archiveTopic, archiveFormat].forEach((input) => {
  input?.addEventListener("input", renderArchive);
  input?.addEventListener("change", renderArchive);
});

archiveClear?.addEventListener("click", () => {
  if (archiveSearch) archiveSearch.value = "";
  if (archiveModule) archiveModule.value = "";
  if (archiveTopic) archiveTopic.value = "";
  if (archiveFormat) archiveFormat.value = "";
  renderArchive();
});

document.querySelectorAll("[data-keyword]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!archiveSearch) return;
    archiveSearch.value = button.dataset.keyword || "";
    renderArchive();
  });
});

archiveResults?.addEventListener("click", async (event) => {
  const button = event.target.closest("[data-copy-text]");
  if (!button) return;

  const original = button.textContent;
  try {
    await navigator.clipboard.writeText(button.dataset.copyText);
    button.textContent = "Copied";
  } catch {
    button.textContent = "Select citation";
  }

  window.setTimeout(() => {
    button.textContent = original;
  }, 1400);
});
