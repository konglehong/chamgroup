const criticalMobileMenuStyle = document.createElement("style");
criticalMobileMenuStyle.setAttribute("data-cham-critical-mobile-menu", "true");
criticalMobileMenuStyle.textContent = `
  @media (max-width: 760px) {
    html,
    body {
      max-width: 100%;
      overflow-x: hidden;
    }

    .site-header {
      position: sticky !important;
      z-index: 100 !important;
      top: 0 !important;
      transform: translateY(0) !important;
      background: rgba(255, 255, 255, 0.98) !important;
    }

    .site-header::after {
      display: none !important;
    }

    .site-header > .top-nav {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }

    .mobile-nav-panel {
      position: fixed !important;
      z-index: 98 !important;
      top: 64px !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      min-height: calc(100svh - 64px) !important;
      padding: 18px 30px 32px !important;
      border-top: 1px solid var(--line) !important;
      background: #fff !important;
      overflow-y: auto !important;
      overscroll-behavior: contain !important;
      opacity: 0 !important;
      pointer-events: none !important;
      visibility: hidden !important;
      transform: translateY(-8px) !important;
      transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s ease !important;
    }

    .site-header.is-menu-open .mobile-nav-panel {
      opacity: 1 !important;
      pointer-events: auto !important;
      visibility: visible !important;
      transform: translateY(0) !important;
    }

    .mobile-nav-panel a {
      display: flex !important;
      align-items: center !important;
      min-height: 72px !important;
      padding: 12px 0 !important;
      border-bottom: 1px solid var(--line) !important;
      color: var(--ink) !important;
      font-size: clamp(38px, 10.8vw, 58px) !important;
      font-weight: 400 !important;
      line-height: 1.08 !important;
      letter-spacing: 0 !important;
      text-transform: uppercase !important;
      white-space: normal !important;
    }

    .mobile-nav-panel a:last-child {
      border-bottom: 0 !important;
    }

    body.is-menu-open {
      overflow: hidden !important;
      touch-action: none !important;
    }
  }

  @media (max-width: 520px) {
    .mobile-nav-panel {
      top: 60px !important;
      min-height: calc(100svh - 60px) !important;
    }
  }
`;
document.head.prepend(criticalMobileMenuStyle);

const responsiveFixHref = "css/responsive-fix.css";
const hasResponsiveFix = Array.from(document.styleSheets).some((styleSheet) => {
  try {
    return styleSheet.href && styleSheet.href.includes(responsiveFixHref);
  } catch {
    return false;
  }
});

if (!hasResponsiveFix) {
  const responsiveFixLink = document.createElement("link");
  responsiveFixLink.rel = "stylesheet";
  responsiveFixLink.href = responsiveFixHref;
  document.head.append(responsiveFixLink);
}

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
let lastScrollY = window.scrollY;
let pointerNearTop = false;

const isMobileViewport = () => window.matchMedia("(max-width: 760px)").matches;

if (header) {
  const existingMobileNavPanel = header.querySelector(".mobile-nav-panel");
  existingMobileNavPanel?.remove();

  const mobileNavPanel = document.createElement("nav");
  mobileNavPanel.className = "mobile-nav-panel";
  mobileNavPanel.setAttribute("aria-label", "Điều hướng chính trên mobile");

  header.querySelectorAll(":scope > .top-nav a").forEach((navLink) => {
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

  header.querySelectorAll(":scope > .top-nav a, .mobile-nav-panel a").forEach((navLink) => {
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

const closeFloatingContact = (floatingContact) => {
  if (!floatingContact) {
    return;
  }

  floatingContact.classList.remove("is-open");
  const toggleButton = floatingContact.querySelector(".floating-contact-toggle");
  toggleButton?.setAttribute("aria-expanded", "false");
};

document.querySelectorAll(".floating-contact-toggle").forEach((toggleButton) => {
  toggleButton.addEventListener("click", (event) => {
    event.stopPropagation();

    const floatingContact = toggleButton.closest(".floating-contact");
    const willOpen = !floatingContact?.classList.contains("is-open");

    document.querySelectorAll(".floating-contact.is-open").forEach((openContact) => {
      if (openContact !== floatingContact) {
        closeFloatingContact(openContact);
      }
    });

    floatingContact?.classList.toggle("is-open", willOpen);
    toggleButton.setAttribute("aria-expanded", String(Boolean(willOpen)));

    if (!willOpen) {
      toggleButton.blur();
    }
  });
});

document.addEventListener("click", (event) => {
  document.querySelectorAll(".floating-contact.is-open").forEach((floatingContact) => {
    if (!floatingContact.contains(event.target)) {
      closeFloatingContact(floatingContact);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".floating-contact.is-open").forEach(closeFloatingContact);
  }
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
