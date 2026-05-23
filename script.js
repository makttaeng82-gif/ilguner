const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const nav = document.querySelector("[data-nav]");

function closeMenu() {
  if (!nav || !menuButton || !header) {
    return;
  }

  nav.classList.remove("is-open");
  header.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", "false");
}

function setupMenu() {
  if (!menuButton || !nav || !header) {
    return;
  }

  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    header.classList.toggle("is-open", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

function setupSlider(slider) {
  const slides = [...slider.querySelectorAll("[data-slide]")];
  const dotContainer = slider.parentElement.querySelector("[data-slider-dots]") || slider.querySelector("[data-slider-dots]");
  const dots = dotContainer ? [...dotContainer.querySelectorAll("[data-slide-dot]")] : [];
  const interval = Number(slider.dataset.interval || 5200);
  let activeSlide = Math.max(
    0,
    slides.findIndex((slide) => slide.classList.contains("is-active")),
  );
  let timer;

  if (slides.length === 0) {
    return;
  }

  function goToSlide(index) {
    activeSlide = index;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === activeSlide;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === activeSlide);
    });
  }

  function start() {
    window.clearInterval(timer);

    if (slides.length < 2) {
      return;
    }

    timer = window.setInterval(() => {
      goToSlide((activeSlide + 1) % slides.length);
    }, interval);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index);
      start();
    });
  });

  goToSlide(activeSlide);
  start();
}

function setupMap() {
  const mapRoot = document.querySelector("[data-map-address]");
  if (!mapRoot) {
    return;
  }

  const address = mapRoot.dataset.mapAddress?.trim();
  const frame = mapRoot.querySelector(".map-frame") || mapRoot.closest("section")?.querySelector(".map-frame");
  const addressText = mapRoot.querySelector("[data-address-text]");

  if (!address || !frame) {
    return;
  }

  if (addressText) {
    addressText.textContent = address;
  }

  frame.src = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}

function setupNewsPagination() {
  const newsList = document.querySelector("[data-news-list]");
  const pagination = document.querySelector("[data-news-pagination]");
  const controls = document.querySelector("[data-news-controls]");

  if (!newsList || !pagination || !controls) {
    return;
  }

  const cards = [...newsList.querySelectorAll(".news-card")];
  const pageSize = 9;
  const pageCount = Math.ceil(cards.length / pageSize);
  let currentPage = 1;

  function syncCards() {
    cards.forEach((card, index) => {
      const page = Math.floor(index / pageSize) + 1;
      card.classList.toggle("is-page-hidden", page !== currentPage);
    });

    controls.classList.toggle("is-hidden", cards.length <= pageSize);

    pagination.querySelectorAll(".news-page-button").forEach((button) => {
      button.classList.toggle("is-active", Number(button.dataset.page) === currentPage);
    });
  }

  pagination.innerHTML = "";
  for (let page = 1; page <= pageCount; page += 1) {
    const button = document.createElement("button");
    button.className = "news-page-button";
    button.type = "button";
    button.dataset.page = String(page);
    button.textContent = String(page);
    button.setAttribute("aria-label", `${page}페이지`);
    button.addEventListener("click", () => {
      currentPage = page;
      syncCards();
    });
    pagination.append(button);
  }

  syncCards();
}

function setupProjectPagination() {
  const projectList = document.querySelector("[data-project-list]");
  const pagination = document.querySelector("[data-project-pagination]");

  if (!projectList || !pagination) {
    return;
  }

  const cards = [...projectList.querySelectorAll(".project-card")];
  const pageSize = 3;
  const pageCount = Math.ceil(cards.length / pageSize);
  let currentPage = 1;

  function syncCards() {
    cards.forEach((card, index) => {
      const page = Math.floor(index / pageSize) + 1;
      card.classList.toggle("is-page-hidden", page !== currentPage);
    });

    pagination.classList.toggle("is-hidden", cards.length <= pageSize);
    pagination.querySelectorAll(".project-page-button").forEach((button) => {
      button.classList.toggle("is-active", Number(button.dataset.page) === currentPage);
    });
  }

  pagination.innerHTML = "";
  for (let page = 1; page <= pageCount; page += 1) {
    const button = document.createElement("button");
    button.className = "project-page-button";
    button.type = "button";
    button.dataset.page = String(page);
    button.textContent = String(page);
    button.setAttribute("aria-label", `${page}페이지`);
    button.addEventListener("click", () => {
      currentPage = page;
      syncCards();
    });
    pagination.append(button);
  }

  syncCards();
}

document.addEventListener("click", (event) => {
  const samePageLink = event.target.closest('a[href^="#"]');

  if (!samePageLink) {
    closeMenu();
    return;
  }

  const target = document.querySelector(samePageLink.getAttribute("href"));
  if (!target) {
    return;
  }

  event.preventDefault();
  closeMenu();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    closeMenu();
  }
});

setupMenu();
setupMap();
setupNewsPagination();
setupProjectPagination();
document.querySelectorAll("[data-slider]").forEach(setupSlider);
