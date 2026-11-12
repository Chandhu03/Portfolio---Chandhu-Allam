(() => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "Close" : "Menu";
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setOpen(false); toggle.focus(); }
    });
  }

  document.querySelectorAll("[data-print]").forEach((b) => b.addEventListener("click", () => window.print()));

  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

  // The hero light drifts slightly with the pointer; skipped for touch and reduced-motion users.
  const light = document.querySelector(".hero__light");
  const fine = window.matchMedia("(pointer: fine)").matches;
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (light && fine && !still) {
    let frame = 0;
    window.addEventListener("pointermove", (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 24;
        const y = (e.clientY / window.innerHeight - 0.5) * 14;
        light.style.setProperty("--lx", `${x.toFixed(1)}px`);
        light.style.setProperty("--ly", `${y.toFixed(1)}px`);
        frame = 0;
      });
    }, { passive: true });
  }
})();
