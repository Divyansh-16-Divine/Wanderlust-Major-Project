document.addEventListener("DOMContentLoaded", function () {
  initializeCardAnimations();
  initializeTaxToggle();
  initializeFilterScrolling();
});

// Card animations
function initializeCardAnimations() {
  const cards = document.querySelectorAll(".listing-card");

  cards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 100 * (index % 6));
  });
}

// Tax toggle functionality
function initializeTaxToggle() {
  const taxToggle = document.getElementById("taxToggle");
  const toggleText = document.querySelector(".toggle-text");

  if (!taxToggle) return;

  function updateTaxDisplay() {
    const taxElements = document.querySelectorAll(".tax-info");
    const isChecked = taxToggle.checked;

    taxElements.forEach((element) => {
      if (isChecked) {
        element.classList.add("show");
      } else {
        element.classList.remove("show");
      }
    });
  }

  taxToggle.addEventListener("change", updateTaxDisplay);

  if (toggleText) {
    toggleText.addEventListener("click", function () {
      taxToggle.checked = !taxToggle.checked;
      updateTaxDisplay();
    });
  }
}

// Filter scrolling - FIXED for mobile
function initializeFilterScrolling() {
  const filterContainer = document.querySelector(".filter-container");

  if (!filterContainer) return;

  // Enable horizontal scrolling on all devices
  let startX;
  let scrollLeft;
  let isDown = false;

  // Mouse events
  filterContainer.addEventListener("mousedown", function (e) {
    isDown = true;
    startX = e.pageX - filterContainer.offsetLeft;
    scrollLeft = filterContainer.scrollLeft;
    filterContainer.style.cursor = "grabbing";
  });

  filterContainer.addEventListener("mouseleave", function () {
    isDown = false;
    filterContainer.style.cursor = "grab";
  });

  filterContainer.addEventListener("mouseup", function () {
    isDown = false;
    filterContainer.style.cursor = "grab";
  });

  filterContainer.addEventListener("mousemove", function (e) {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - filterContainer.offsetLeft;
    const walk = (x - startX) * 2;
    filterContainer.scrollLeft = scrollLeft - walk;
  });

  // Touch events for mobile
  let touchStartX = 0;
  let touchScrollLeft = 0;

  filterContainer.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.touches[0].clientX;
      touchScrollLeft = filterContainer.scrollLeft;
    },
    { passive: true }
  );

  filterContainer.addEventListener(
    "touchmove",
    function (e) {
      const touchX = e.touches[0].clientX;
      const moveX = touchStartX - touchX;
      filterContainer.scrollLeft = touchScrollLeft + moveX;
    },
    { passive: true }
  );

  // Wheel scrolling for desktop
  filterContainer.addEventListener(
    "wheel",
    function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Horizontal scroll
        return;
      }

      e.preventDefault();
      filterContainer.scrollLeft += e.deltaY;
    },
    { passive: false }
  );

  // Set initial cursor
  filterContainer.style.cursor = "grab";
}
