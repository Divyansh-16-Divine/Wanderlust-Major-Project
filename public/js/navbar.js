// Navbar functionality
document.addEventListener("DOMContentLoaded", function () {
  initializeSearch();
  initializeNavbarInteractions();
  setActiveNavLink();
});

// Search functionality
function initializeSearch() {
  const searchForm = document.querySelector(".search-form");
  const searchInput = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");

  if (!searchForm || !searchInput) return;

  // Handle form submission
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const searchQuery = searchInput.value.trim();

    if (searchQuery === "") {
      // Add shake animation for empty search
      searchInput.style.animation = "shake 0.5s ease-in-out";
      searchInput.focus();

      setTimeout(() => {
        searchInput.style.animation = "";
      }, 500);

      return;
    }

    // Show loading state
    if (searchBtn) {
      const originalContent = searchBtn.innerHTML;
      searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      searchBtn.disabled = true;

      // Simulate search delay then redirect
      setTimeout(() => {
        window.location.href = `/listings/search?q=${encodeURIComponent(
          searchQuery
        )}`;
      }, 500);
    } else {
      // Direct redirect if no button
      window.location.href = `/listings/search?q=${encodeURIComponent(
        searchQuery
      )}`;
    }
  });

  // Enhanced search input interactions
  searchInput.addEventListener("focus", function () {
    this.parentElement.style.transform = "scale(1.02)";
  });

  searchInput.addEventListener("blur", function () {
    this.parentElement.style.transform = "scale(1)";
  });

  // Auto-suggest functionality (optional)
  let searchTimeout;
  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      const query = this.value.trim();
      if (query.length >= 2) {
        // You can implement auto-suggestions here
        showSearchSuggestions(query);
      } else {
        hideSearchSuggestions();
      }
    }, 300);
  });
}

// Auto-suggestions (optional feature)
function showSearchSuggestions(query) {
  // Remove existing suggestions
  hideSearchSuggestions();

  const searchContainer = document.querySelector(".search-container");
  if (!searchContainer) return;

  // Sample suggestions - you can replace with actual API call
  const suggestions = [
    "Beach resorts",
    "Mountain cabins",
    "City apartments",
    "Luxury villas",
    "Farm stays",
  ].filter((item) => item.toLowerCase().includes(query.toLowerCase()));

  if (suggestions.length === 0) return;

  const suggestionsDiv = document.createElement("div");
  suggestionsDiv.className = "search-suggestions";
  suggestionsDiv.innerHTML = suggestions
    .map(
      (suggestion) =>
        `<div class="suggestion-item" data-suggestion="${suggestion}">${suggestion}</div>`
    )
    .join("");

  searchContainer.appendChild(suggestionsDiv);

  // Handle suggestion clicks
  suggestionsDiv.addEventListener("click", function (e) {
    if (e.target.classList.contains("suggestion-item")) {
      const suggestion = e.target.dataset.suggestion;
      document.querySelector(".search-input").value = suggestion;
      hideSearchSuggestions();
      document.querySelector(".search-form").dispatchEvent(new Event("submit"));
    }
  });
}

function hideSearchSuggestions() {
  const suggestions = document.querySelector(".search-suggestions");
  if (suggestions) {
    suggestions.remove();
  }
}

// Navbar interaction enhancements
function initializeNavbarInteractions() {
  // Smooth scroll to top when clicking brand
  const brand = document.querySelector(".navbar-brand");
  if (brand) {
    brand.addEventListener("click", function (e) {
      if (
        window.location.pathname === "/listings" ||
        window.location.pathname === "/"
      ) {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });
  }

  // Enhanced mobile menu toggle
  const navbarToggler = document.querySelector(".navbar-toggler");
  const navbarCollapse = document.querySelector(".navbar-collapse");

  if (navbarToggler && navbarCollapse) {
    navbarToggler.addEventListener("click", function () {
      // Add custom animation class
      navbarCollapse.classList.add("animating");

      setTimeout(() => {
        navbarCollapse.classList.remove("animating");
      }, 300);
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    const navbar = document.querySelector(".navbar");
    const isClickInsideNavbar = navbar && navbar.contains(e.target);

    if (
      !isClickInsideNavbar &&
      navbarCollapse &&
      navbarCollapse.classList.contains("show")
    ) {
      const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
        toggle: false,
      });
      bsCollapse.hide();
    }
  });

  // Close mobile menu when clicking nav links
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (
        window.innerWidth < 768 &&
        navbarCollapse &&
        navbarCollapse.classList.contains("show")
      ) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
          toggle: false,
        });
        bsCollapse.hide();
      }
    });
  });
}

// Set active navigation link based on current page
function setActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    link.classList.remove("active");

    const linkPath = new URL(link.href).pathname;

    if (
      currentPath === linkPath ||
      (currentPath.startsWith("/listings") && linkPath === "/listings")
    ) {
      link.classList.add("active");
    }
  });
}

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault();
    const searchInput = document.querySelector(".search-input");
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }

  // Escape to close suggestions
  if (e.key === "Escape") {
    hideSearchSuggestions();
  }
});

// Add CSS styles if not already added
if (!document.getElementById("navbar-styles")) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "navbar-styles";
  styleSheet.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-5px); }
      75% { transform: translateX(5px); }
    }

    .search-suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      z-index: 1000;
      max-height: 200px;
      overflow-y: auto;
      margin-top: 4px;
    }

    .suggestion-item {
      padding: 0.75rem 1.25rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
      font-size: 0.9rem;
      color: #374151;
    }

    .suggestion-item:hover {
      background-color: rgba(254, 66, 77, 0.08);
      color: #fe424d;
    }

    .suggestion-item:first-child {
      border-radius: 12px 12px 0 0;
    }

    .suggestion-item:last-child {
      border-radius: 0 0 12px 12px;
    }

    .navbar-collapse.animating {
      transition: all 0.3s ease-in-out;
    }
  `;
  document.head.appendChild(styleSheet);
}
