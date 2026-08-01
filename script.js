(() => {
  "use strict";

  /* ---------------------------------------------------------------------
   * PROJECT DOCUMENTATION LINKS — the only place you need to edit.
   *
   * Paste the Google Docs share URL beside a project id and every "Report"
   * button for that project turns into a working external link automatically
   * (new tab, rel="noopener noreferrer"). Leave the string empty and the
   * button stays in its disabled "Coming soon" state — never a broken link.
   *
   * Tip: in Google Docs use File → Share → Publish to web, or set the share
   * setting to "Anyone with the link" so recruiters can open it.
   * ------------------------------------------------------------------- */
  const PROJECTS = {
    "ece-567-capstone": { googleDoc: "" },
    "ece-570-digital-forensics": { googleDoc: "" },
    "iot-intrusion-detection": { googleDoc: "" },
    "securetext": { googleDoc: "" }
  };

  const body = document.body;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector(".primary-nav");

  const setHeaderState = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  document.querySelectorAll("[data-current-year]").forEach((year) => {
    year.textContent = String(new Date().getFullYear());
  });

  const closeMenu = () => {
    if (!menuToggle || !primaryNav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    primaryNav.classList.remove("is-open");
    body.classList.remove("menu-open");
  };

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      primaryNav.classList.toggle("is-open", !isOpen);
      body.classList.toggle("menu-open", !isOpen);
    });

    primaryNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  const navigationLinks = [...document.querySelectorAll("[data-nav-link]")];
  const sectionMap = navigationLinks
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter(({ section }) => section);

  if (sectionMap.length && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!activeEntry) return;
        sectionMap.forEach(({ link, section }) => {
          link.classList.toggle("is-active", section === activeEntry.target);
        });
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0.1, 0.3, 0.55] }
    );

    sectionMap.forEach(({ section }) => sectionObserver.observe(section));
  }

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealElements = [...document.querySelectorAll(".reveal")];

  if (revealElements.length && !reduceMotion && "IntersectionObserver" in window) {
    body.classList.add("motion-ready");
    revealElements.forEach((element) => {
      if (element.dataset.delay) element.style.setProperty("--reveal-delay", `${element.dataset.delay}ms`);
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  /* Add a Documentation link to any action row whose project has a googleDoc
     URL set. Nothing is rendered while the URL is empty, so a project without
     documentation shows no placeholder and no leftover spacing. */
  document.querySelectorAll("[data-google-doc]").forEach((row) => {
    const project = PROJECTS[row.dataset.googleDoc];
    const url = project && typeof project.googleDoc === "string" ? project.googleDoc.trim() : "";
    if (!url) return;

    const link = document.createElement("a");
    link.className = row.dataset.docClass || "button button-secondary button-sm";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";

    const hint = document.createElement("span");
    hint.className = "sr-only";
    hint.textContent = " (opens in a new tab)";

    link.append("Documentation ", arrow, hint);
    row.append(link);
  });

  const projectsGrid = document.querySelector("[data-projects-grid]");

  if (projectsGrid) {
    const cards = [...projectsGrid.querySelectorAll("[data-project-card]")];
    const filterButtons = [...document.querySelectorAll("[data-filter]")];
    const searchInput = document.querySelector("[data-project-search]");
    const resultsCount = document.querySelector("[data-results-count]");
    const emptyState = document.querySelector("[data-empty-state]");
    let activeFilter = "all";

    const applyFilters = () => {
      const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
      let visible = 0;

      cards.forEach((card) => {
        const categories = (card.dataset.categories || "").split("|");
        const haystack = (card.dataset.search || card.textContent).toLowerCase();
        const matchesFilter = activeFilter === "all" || categories.includes(activeFilter);
        const matchesQuery = query === "" || haystack.includes(query);
        const isVisible = matchesFilter && matchesQuery;

        card.hidden = !isVisible;
        if (isVisible) visible += 1;
      });

      if (resultsCount) {
        const total = document.createElement("strong");
        total.textContent = String(visible);
        resultsCount.textContent = "";
        resultsCount.append("Showing ", total, ` of ${cards.length} projects`);
      }

      if (emptyState) emptyState.hidden = visible !== 0;
    };

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter || "all";
        filterButtons.forEach((item) => {
          item.setAttribute("aria-pressed", String(item === button));
        });
        applyFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
      searchInput.addEventListener("search", applyFilters);
    }

    applyFilters();
  }

  const createOverlay = ({ label, content, onClose }) => {
    const overlay = document.createElement("div");
    overlay.className = "lightbox is-open";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", label);

    const dialog = document.createElement("div");
    dialog.className = "lightbox-dialog";
    const closeButton = document.createElement("button");
    closeButton.className = "lightbox-close";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close dialog");
    closeButton.textContent = "×";
    dialog.append(closeButton, content);
    overlay.append(dialog);
    document.body.append(overlay);

    const activeElement = document.activeElement;
    body.classList.add("overlay-open");
    closeButton.focus();

    const close = () => {
      overlay.classList.remove("is-open");
      body.classList.remove("overlay-open");
      document.removeEventListener("keydown", onKeyDown);
      window.setTimeout(() => overlay.remove(), 180);
      if (activeElement instanceof HTMLElement) activeElement.focus();
      if (typeof onClose === "function") onClose();
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") close();
    };

    closeButton.addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });
    document.addEventListener("keydown", onKeyDown);
  };

  document.addEventListener("click", (event) => {
    const screenshot = event.target.closest("[data-lightbox-title]");
    if (screenshot) {
      event.preventDefault();
      const content = document.createElement("div");
      content.className = "lightbox-content";
      const illustration = document.createElement("div");
      illustration.className = "screenshot-surface";
      const caption = document.createElement("p");
      caption.className = "lightbox-caption";
      caption.textContent = screenshot.dataset.lightboxTitle || "Project visual";
      content.append(illustration, caption);
      createOverlay({ label: caption.textContent, content });
      return;
    }

    const reportLink = event.target.closest("[data-report-url]");
    if (reportLink) {
      event.preventDefault();
      const source = reportLink.dataset.reportUrl;
      if (!source) return;
      const content = document.createElement("div");
      content.className = "lightbox-content report-viewer";
      const frame = document.createElement("iframe");
      frame.src = source;
      frame.title = reportLink.dataset.reportTitle || "Project report";
      frame.loading = "lazy";
      frame.setAttribute("referrerpolicy", "no-referrer");
      content.append(frame);
      createOverlay({ label: frame.title, content });
    }
  });
})();
