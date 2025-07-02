// Smooth scroll to map function
function scrollToMap() {
  const mapSection = document.querySelector("#map-section");
  if (mapSection) {
    mapSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });

    // Add a subtle highlight effect to the map section
    mapSection.style.transform = "scale(1.02)";
    mapSection.style.transition = "transform 0.3s ease";

    setTimeout(() => {
      mapSection.style.transform = "scale(1)";
    }, 300);

    // Remove focus from the clicked element to prevent blur state
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }
}

// New function to scroll to reviews section
function scrollToReviews() {
  const reviewsSection = document.querySelector("#reviews-section");
  if (reviewsSection) {
    reviewsSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });

    // Add a subtle highlight effect to the reviews section
    reviewsSection.style.transform = "scale(1.01)";
    reviewsSection.style.transition = "transform 0.3s ease";

    setTimeout(() => {
      reviewsSection.style.transform = "scale(1)";
    }, 300);

    // Remove focus from the clicked element to prevent blur state
    if (document.activeElement) {
      document.activeElement.blur();
    }
  }
}

// Handle keyboard navigation for location button
function handleLocationKeydown(event) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    scrollToMap();
  }
}

// Add loading animations - improved to prevent layout shifts
document.addEventListener("DOMContentLoaded", function () {
  // Small delay to ensure all styles are loaded
  setTimeout(() => {
    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((element, index) => {
      element.classList.add("animate");
      element.style.animationDelay = `${index * 0.1}s`;
    });
  }, 100);

  // Prevent scroll jumping
  document.body.style.overflowX = "hidden";
  document.documentElement.style.overflowX = "hidden";
});

// Handle window resize to prevent layout issues
window.addEventListener("resize", function () {
  clearTimeout(window.resizeTimer);
  window.resizeTimer = setTimeout(function () {
    // Force reflow to fix any layout issues
    document.body.style.display = "none";
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = "";
  }, 150);
});

// Remove any lingering focus states when clicking anywhere on the page
document.addEventListener("click", function (event) {
  // Only blur if we're not clicking on an interactive element
  if (!event.target.matches("input, textarea, select, button, a, [tabindex]")) {
    if (document.activeElement && document.activeElement !== document.body) {
      document.activeElement.blur();
    }
  }
});

// MAP SCROLL FIX - SOLUTION 1: Simple Click-to-activate (RECOMMENDED)
document.addEventListener("DOMContentLoaded", function () {
  const map = document.getElementById("map");

  if (map) {
    // Add click event to activate map
    map.addEventListener("click", function () {
      this.classList.add("map-active");
    });

    // Deactivate when clicking outside
    document.addEventListener("click", function (e) {
      if (!map.contains(e.target)) {
        map.classList.remove("map-active");
      }
    });
  }
});

// ALTERNATIVE SOLUTION: Ctrl+Scroll approach (uncomment if you prefer this)
/*
document.addEventListener("DOMContentLoaded", function () {
  const map = document.getElementById("map");

  if (map) {
    map.addEventListener(
      "wheel",
      function (e) {
        // Only allow map zoom when Ctrl is pressed
        if (!e.ctrlKey) {
          e.preventDefault();
          // Let the page scroll instead
          window.scrollBy(0, e.deltaY);
        }
      },
      { passive: false }
    );
  }
});
*/
