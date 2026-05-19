const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
let lastScrollY = window.scrollY;
let pointerNearTop = false;

const isMobileViewport = () => window.matchMedia("(max-width: 760px)").matches;

if (header) {
  header.querySelector(".mobile-nav-panel")?.remove();

  const mobileNavPanel = document.createElement("nav");
  mobileNavPanel.className = "mobile-nav-panel";
  mobileNavPanel.setAttribute("aria-label", "Điều hướng chính trên mobile");

  header.querySelectorAll(".top-nav a").forEach((navLink) => {
    mobileNavPanel.append(navLink.cloneNode(true));
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
    const shouldHide = scrollingDown && currentScrollY > 120 && !pointerNearTop && !header.classList.contains("is-menu-open");
    header.classList.toggle("is-hidden", shouldHide);
    lastScrollY = Math.max(currentScrollY, 0);
  };

  window.addEventListener("scroll", updateHeaderVisibility, { passive: true });
  window.addEventListener("resize", () => {
    if (!isMobileViewport()) setMenuOpen(false);
    updateHeaderVisibility();
  }, { passive: true });
  window.addEventListener("mousemove", (event) => {
    if (isMobileViewport()) return;
    const isNearTop = event.clientY <= (header.offsetHeight || 100);
    if (isNearTop !== pointerNearTop) {
      pointerNearTop = isNearTop;
      header.classList.toggle("is-hidden", !pointerNearTop && window.scrollY > 120 && !header.classList.contains("is-menu-open"));
    }
  }, { passive: true });

  menuToggle?.addEventListener("click", () => setMenuOpen(!header.classList.contains("is-menu-open")));
  header.querySelectorAll(".top-nav a, .mobile-nav-panel a").forEach((navLink) => navLink.addEventListener("click", () => setMenuOpen(false)));
  document.addEventListener("click", (event) => {
    if (header.classList.contains("is-menu-open") && !header.contains(event.target)) setMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });
}

const setFieldError = (field, message = "") => {
  const label = field.closest("label");
  const error = label?.querySelector("small");
  if (error) error.textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
};

document.querySelectorAll(".brief-form").forEach((briefForm) => {
  const status = document.createElement("p");
  status.className = "brief-form-status form-wide";
  status.setAttribute("role", "status");
  briefForm.append(status);

  const validateField = (field) => {
    if (field.validity.valueMissing) {
      setFieldError(field, "Vui lòng điền thông tin này.");
      return false;
    }
    if (field.type === "email" && field.validity.typeMismatch) {
      setFieldError(field, "Email chưa đúng định dạng.");
      return false;
    }
    if (field.name === "phone" && field.validity.patternMismatch) {
      setFieldError(field, "Số điện thoại chưa đúng định dạng.");
      return false;
    }
    setFieldError(field);
    return true;
  };

  briefForm.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  briefForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = Array.from(briefForm.querySelectorAll("input, select, textarea"));
    const isValid = fields.map(validateField).every(Boolean);

    if (!isValid) {
      status.textContent = "Vui lòng kiểm tra lại các trường bắt buộc.";
      fields.find((field) => field.getAttribute("aria-invalid") === "true")?.focus();
      return;
    }

    const submitButton = briefForm.querySelector("button");
    status.textContent = "Chạm đã nhận brief. Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.";
    submitButton.textContent = "Đã nhận brief";
    submitButton.disabled = true;

    window.setTimeout(() => {
      submitButton.textContent = "Gửi brief";
      submitButton.disabled = false;
      status.textContent = "";
      briefForm.reset();
    }, 2800);
  });
});

const closeFloatingContact = (floatingContact) => {
  floatingContact?.classList.remove("is-open");
  floatingContact?.querySelector(".floating-contact-toggle")?.setAttribute("aria-expanded", "false");
};

document.querySelectorAll(".floating-contact-toggle").forEach((toggleButton) => {
  toggleButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const floatingContact = toggleButton.closest(".floating-contact");
    const willOpen = !floatingContact?.classList.contains("is-open");
    document.querySelectorAll(".floating-contact.is-open").forEach((openContact) => {
      if (openContact !== floatingContact) closeFloatingContact(openContact);
    });
    floatingContact?.classList.toggle("is-open", willOpen);
    toggleButton.setAttribute("aria-expanded", String(Boolean(willOpen)));
  });
});

document.addEventListener("click", (event) => {
  document.querySelectorAll(".floating-contact.is-open").forEach((floatingContact) => {
    if (!floatingContact.contains(event.target)) closeFloatingContact(floatingContact);
  });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") document.querySelectorAll(".floating-contact.is-open").forEach(closeFloatingContact);
});

const filterButtons = document.querySelectorAll(".pill-nav button[data-filter]");
const filterableItems = document.querySelectorAll("[data-category]");
filterButtons.forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    const filter = filterButton.dataset.filter;
    filterButtons.forEach((button) => button.classList.toggle("active", button === filterButton));
    filterableItems.forEach((item) => {
      item.style.display = filter === "all" || item.dataset.category === filter ? "" : "none";
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("reveal-ready");
  const revealElements = document.querySelectorAll("section h1, section h2, section h3, section p:not(.brief-form-status), section img:not([aria-hidden='true']), .project-card, .journal-list a, .service-rows article, .process-line article, .method-index article");
  revealElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    element.classList.add("js-reveal");
    if (rect.top < window.innerHeight * 0.15) element.classList.add("is-revealed");
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".js-reveal").forEach((element) => observer.observe(element));

  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    document.body.appendChild(cursor);
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;
    window.addEventListener("mousemove", (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    }, { passive: true });
    const renderCursor = () => {
      cursorX += (mouseX - cursorX) * 0.16;
      cursorY += (mouseY - cursorY) * 0.16;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);
    document.querySelectorAll("a, button, input, select, textarea").forEach((element) => {
      element.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
      element.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
    });
  }
});
