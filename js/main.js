const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
let lastScrollY = window.scrollY;
let pointerNearTop = false;

const mobileFixStyle = document.createElement("style");
mobileFixStyle.setAttribute("data-cham-mobile-fix", "true");
mobileFixStyle.textContent = `
  html,
  body {
    max-width: 100%;
    overflow-x: hidden;
  }

  @media (max-width: 760px) {
    .site-header {
      position: sticky;
      z-index: 100;
      transform: translateY(0) !important;
      background: rgba(255, 255, 255, 0.98);
    }

    .site-header::after {
      display: none !important;
    }

    .site-header .top-nav {
      display: none !important;
    }

    .mobile-nav-panel {
      position: fixed;
      z-index: 98;
      top: 64px;
      left: 0;
      right: 0;
      bottom: 0;
      min-height: calc(100svh - 64px);
      padding: 18px 30px 32px;
      border-top: 1px solid var(--line);
      background: #fff;
      overflow-y: auto;
      overscroll-behavior: contain;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
      transform: translateY(-8px);
      transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease;
    }

    .site-header.is-menu-open .mobile-nav-panel {
      opacity: 1;
      pointer-events: auto;
      visibility: visible;
      transform: translateY(0);
    }

    .mobile-nav-panel a {
      display: flex;
      align-items: center;
      min-height: 72px;
      padding: 12px 0;
      border-bottom: 1px solid var(--line);
      color: var(--ink);
      font-size: clamp(38px, 10.8vw, 58px);
      font-weight: 400;
      line-height: 1.08;
      letter-spacing: 0;
      text-transform: uppercase;
      white-space: normal;
    }

    .mobile-nav-panel a:last-child {
      border-bottom: 0;
    }

    body.is-menu-open {
      overflow: hidden;
      touch-action: none;
    }

    body.is-menu-open .floating-contact {
      opacity: 0;
      pointer-events: none;
    }

    .hero,
    .page-image-hero {
      min-height: min(520px, calc(100svh - 60px));
    }

    .project-grid,
    .project-grid-four {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 6px;
      max-width: 100%;
    }

    .project-grid {
      padding-left: var(--page-pad);
      padding-right: var(--page-pad);
    }

    .project-tile,
    .project-tile-large {
      grid-column: span 1 !important;
      grid-row: span 1 !important;
      aspect-ratio: 1.05 / 1;
    }

    .studio-list,
    .method-list,
    .process-list,
    .service-list,
    .news-list,
    .contact-panel,
    .footer {
      max-width: 100%;
    }
  }

  @media (max-width: 520px) {
    .mobile-nav-panel {
      top: 60px;
      min-height: calc(100svh - 60px);
      padding: 18px 30px 28px;
    }

    .mobile-nav-panel a {
      min-height: 72px;
      font-size: clamp(40px, 11.4vw, 56px);
      line-height: 1.08;
    }

    .project-grid,
    .project-grid-four {
      grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      gap: 6px;
    }

    .project-tile,
    .project-tile-large {
      grid-column: span 1 !important;
      aspect-ratio: 1.02 / 1;
    }

    .project-tile span {
      left: 10px;
      right: 10px;
      bottom: 10px;
      font-size: 10px;
      line-height: 1.2;
    }

    .hero,
    .page-image-hero {
      min-height: 500px;
    }
  }
`;
document.head.append(mobileFixStyle);

const isMobileViewport = () => window.matchMedia("(max-width: 760px)").matches;

if (header) {
  const mobileNavPanel = document.createElement("nav");
  mobileNavPanel.className = "mobile-nav-panel";
  mobileNavPanel.setAttribute("aria-label", "Điều hướng chính trên mobile");

  header.querySelectorAll(".top-nav a").forEach((navLink) => {
    const mobileLink = navLink.cloneNode(true);
    mobileNavPanel.append(mobileLink);
  });

  header.append(mobileNavPanel);

  const setMenuOpen = (isOpen) => {
    header.classList.toggle("is-menu-open", isOpen);
    document.body.classList.toggle("is-menu-open", isOpen);
    menuToggle?.setAttribute("aria-expanded", String(isOpen));
    menuToggle?.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
  };

  const updateHeaderVisibility = () => {
    const currentScrollY = window.scrollY;

    if (isMobileViewport()) {
      header.classList.remove("is-hidden");
      lastScrollY = Math.max(currentScrollY, 0);
      return;
    }

    const scrollingDown = currentScrollY > lastScrollY;
    const shouldHide = scrollingDown && currentScrollY > 96 && !pointerNearTop && !header.classList.contains("is-menu-open");

    header.classList.toggle("is-hidden", shouldHide);
    lastScrollY = Math.max(currentScrollY, 0);
  };

  window.addEventListener("scroll", () => {
    updateHeaderVisibility();
  }, { passive: true });

  window.addEventListener("resize", () => {
    if (!isMobileViewport()) {
      setMenuOpen(false);
    }

    updateHeaderVisibility();
  }, { passive: true });

  window.addEventListener("mousemove", (event) => {
    if (isMobileViewport()) {
      return;
    }

    const isNearTop = event.clientY <= 86;

    if (isNearTop !== pointerNearTop) {
      pointerNearTop = isNearTop;
      header.classList.toggle("is-hidden", !pointerNearTop && window.scrollY > 96 && !header.classList.contains("is-menu-open"));
    }
  }, { passive: true });

  menuToggle?.addEventListener("click", () => {
    setMenuOpen(!header.classList.contains("is-menu-open"));
  });

  header.querySelectorAll(".top-nav a, .mobile-nav-panel a").forEach((navLink) => {
    navLink.addEventListener("click", () => {
      setMenuOpen(false);
    });
  });

  document.addEventListener("click", (event) => {
    if (!header.classList.contains("is-menu-open") || header.contains(event.target)) {
      return;
    }

    setMenuOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });
}

document.querySelectorAll(".brief-form").forEach((briefForm) => {
  const status = document.createElement("p");
  status.className = "brief-form-status form-wide";
  status.setAttribute("role", "status");
  briefForm.append(status);

  briefForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!briefForm.checkValidity()) {
      briefForm.reportValidity();
      return;
    }

    const submitButton = briefForm.querySelector("button");
    status.textContent = "Cảm ơn bạn. Chạm sẽ liên hệ lại qua hotline trong thời gian sớm nhất.";
    submitButton.textContent = "Đã nhận brief";
    submitButton.disabled = true;
    window.setTimeout(() => {
      submitButton.textContent = "Gửi brief";
      submitButton.disabled = false;
      status.textContent = "";
    }, 2400);
  });
});

document.querySelectorAll(".floating-contact-toggle").forEach((toggleButton) => {
  toggleButton.addEventListener("click", () => {
    const floatingContact = toggleButton.closest(".floating-contact");
    const isOpen = floatingContact?.classList.toggle("is-open");
    toggleButton.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });
});

const projectFilterButtons = document.querySelectorAll(".project-categories button");
const projectTiles = document.querySelectorAll(".projects-page-section .project-tile");

projectFilterButtons.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    const filter = filterButton.dataset.filter;

    projectFilterButtons.forEach((button) => {
      button.classList.toggle("is-active", button === filterButton);
    });

    projectTiles.forEach((tile) => {
      const categories = tile.dataset.category ? tile.dataset.category.split(" ") : [];
      const shouldShow = filter === "all" || categories.includes(filter);
      tile.classList.toggle("is-hidden", !shouldShow);
    });
  });
});
