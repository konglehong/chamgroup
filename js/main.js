const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
let lastScrollY = window.scrollY;
let pointerNearTop = false;

if (header) {
  const setMenuOpen = (isOpen) => {
    header.classList.toggle("is-menu-open", isOpen);
    document.body.classList.toggle("is-menu-open", isOpen);
    menuToggle?.setAttribute("aria-expanded", String(isOpen));
    menuToggle?.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
  };

  const updateHeaderVisibility = () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const shouldHide = scrollingDown && currentScrollY > 96 && !pointerNearTop && !header.classList.contains("is-menu-open");

    header.classList.toggle("is-hidden", shouldHide);
    lastScrollY = Math.max(currentScrollY, 0);
  };

  window.addEventListener("scroll", () => {
    updateHeaderVisibility();
  }, { passive: true });

  window.addEventListener("mousemove", (event) => {
    const isNearTop = event.clientY <= 86;

    if (isNearTop !== pointerNearTop) {
      pointerNearTop = isNearTop;
      header.classList.toggle("is-hidden", !pointerNearTop && window.scrollY > 96 && !header.classList.contains("is-menu-open"));
    }
  }, { passive: true });

  menuToggle?.addEventListener("click", () => {
    setMenuOpen(!header.classList.contains("is-menu-open"));
  });

  header.querySelectorAll(".top-nav a").forEach((navLink) => {
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
