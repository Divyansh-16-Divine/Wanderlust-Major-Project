// Wait for the DOM to load - LISTING FORM
document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("form");

  // Safety check - only proceed if we have listing form elements
  var priceInput = document.getElementById("price");
  var titleInput = document.getElementById("title");
  var descriptionInput = document.getElementById("description");
  var imageInput = document.getElementById("image");
  var countryInput = document.getElementById("country");
  var locationInput = document.getElementById("location");

  // Only proceed if this looks like a listing form
  if (
    !priceInput ||
    !titleInput ||
    !descriptionInput ||
    !countryInput ||
    !locationInput
  ) {
    return; // Exit if not a listing form
  }

  // Add novalidate attribute to disable browser validation prompts
  form.setAttribute("novalidate", "");

  // Function to validate price
  function validatePrice() {
    var priceValue = priceInput.value.trim();

    // Remove both classes first
    priceInput.classList.remove("is-valid", "is-invalid");

    // Check if the price is a valid positive number
    if (isNaN(priceValue) || priceValue <= 0 || priceValue === "") {
      priceInput.classList.add("is-invalid");
      return false;
    } else {
      priceInput.classList.add("is-valid");
      return true;
    }
  }

  // Function to validate required fields
  function validateRequiredField(input) {
    var value = input.value.trim();

    // Remove both classes first
    input.classList.remove("is-valid", "is-invalid");

    if (value === "") {
      input.classList.add("is-invalid");
      return false;
    } else {
      input.classList.add("is-valid");
      return true;
    }
  }

  // Function to validate optional fields (only show valid state, not invalid)
  function validateOptionalField(input) {
    var value = input.value.trim();

    // Remove both classes first
    input.classList.remove("is-valid", "is-invalid");

    // For optional fields, only add valid class if there's content
    // Don't add invalid class for empty optional fields
    if (value !== "") {
      input.classList.add("is-valid");
    }

    return true; // Optional fields are always "valid"
  }

  // Function to validate all fields
  function validateAllFields() {
    var isPriceValid = validatePrice();
    var isTitleValid = validateRequiredField(titleInput);
    var isDescriptionValid = validateRequiredField(descriptionInput);
    var isCountryValid = validateRequiredField(countryInput);
    var isLocationValid = validateRequiredField(locationInput);

    // Check if image field is required or optional
    var isImageValid = true;
    if (imageInput && imageInput.hasAttribute("required")) {
      isImageValid = validateRequiredField(imageInput);
    } else if (imageInput) {
      validateOptionalField(imageInput); // This won't affect form validity
    }

    return (
      isPriceValid &&
      isTitleValid &&
      isDescriptionValid &&
      isImageValid &&
      isCountryValid &&
      isLocationValid
    );
  }

  // Real-time validation on input
  priceInput.addEventListener("input", validatePrice);
  priceInput.addEventListener("blur", validatePrice);

  titleInput.addEventListener("input", function () {
    validateRequiredField(titleInput);
  });
  titleInput.addEventListener("blur", function () {
    validateRequiredField(titleInput);
  });

  descriptionInput.addEventListener("input", function () {
    validateRequiredField(descriptionInput);
  });
  descriptionInput.addEventListener("blur", function () {
    validateRequiredField(descriptionInput);
  });

  // Image field validation - check if required or optional
  if (imageInput) {
    imageInput.addEventListener("input", function () {
      if (imageInput.hasAttribute("required")) {
        validateRequiredField(imageInput);
      } else {
        validateOptionalField(imageInput);
      }
    });
    imageInput.addEventListener("blur", function () {
      if (imageInput.hasAttribute("required")) {
        validateRequiredField(imageInput);
      } else {
        validateOptionalField(imageInput);
      }
    });
  }

  countryInput.addEventListener("input", function () {
    validateRequiredField(countryInput);
  });
  countryInput.addEventListener("blur", function () {
    validateRequiredField(countryInput);
  });

  locationInput.addEventListener("input", function () {
    validateRequiredField(locationInput);
  });
  locationInput.addEventListener("blur", function () {
    validateRequiredField(locationInput);
  });

  // Form submission handler
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    var isFormValid = validateAllFields();

    if (isFormValid) {
      form.submit(); // ✅ Submit the actual form with file included
    }
  });
});

// REVIEW FORM
document.addEventListener("DOMContentLoaded", function () {
  // Get the review form separately
  var reviewForm = document.querySelector(
    'form[action^="/listings/"][action$="/reviews"]'
  );
  if (!reviewForm) return;

  var ratingInputs = document.querySelectorAll('input[name="review[rating]"]');
  var commentInput = document.getElementById("comment");
  var starabilityFieldset = document.querySelector(".starability-slot");

  // Safety check
  if (!ratingInputs.length || !commentInput) return;

  // Create and add error message div for rating if it doesn't exist
  var ratingErrorDiv = document.createElement("div");
  ratingErrorDiv.className = "invalid-feedback";
  ratingErrorDiv.textContent = "Please select a rating!";
  ratingErrorDiv.style.display = "none";
  if (
    starabilityFieldset &&
    !starabilityFieldset.nextElementSibling?.classList.contains(
      "invalid-feedback"
    )
  ) {
    starabilityFieldset.parentNode.insertBefore(
      ratingErrorDiv,
      starabilityFieldset.nextSibling
    );
  }

  function validateRating() {
    var selectedRating = document.querySelector(
      'input[name="review[rating]"]:checked'
    );

    if (starabilityFieldset) {
      starabilityFieldset.classList.remove("is-valid", "is-invalid");
    }

    // Check if a rating is selected and it's not the "no-rate" option (value 0)
    if (!selectedRating || selectedRating.value === "0") {
      if (starabilityFieldset) {
        starabilityFieldset.classList.add("is-invalid");
      }
      ratingErrorDiv.style.display = "block";
      return false;
    } else {
      if (starabilityFieldset) {
        starabilityFieldset.classList.add("is-valid");
      }
      ratingErrorDiv.style.display = "none";
      return true;
    }
  }

  function validateComment() {
    commentInput.classList.remove("is-valid", "is-invalid");
    if (!commentInput.value.trim()) {
      commentInput.classList.add("is-invalid");
      return false;
    } else {
      commentInput.classList.add("is-valid");
      return true;
    }
  }

  // Add event listeners to all rating radio buttons
  ratingInputs.forEach(function (input) {
    input.addEventListener("change", validateRating);
  });

  commentInput.addEventListener("input", validateComment);
  commentInput.addEventListener("blur", validateComment);

  reviewForm.addEventListener("submit", function (e) {
    e.preventDefault();
    e.stopPropagation();

    var isRatingValid = validateRating();
    var isCommentValid = validateComment();
    var isValid = isRatingValid && isCommentValid;

    // Force show Bootstrap validation styles
    reviewForm.classList.add("was-validated");

    if (isValid) {
      reviewForm.submit();
    }
  });
});

// USER REGISTRATION/LOGIN FORM
document.addEventListener("DOMContentLoaded", function () {
  var usernameInput = document.getElementById("username");
  var emailInput = document.getElementById("email");
  var passwordInput = document.getElementById("password");

  // Check if this is a login form (username + password) or registration form (username + email + password)
  var isLoginForm = usernameInput && passwordInput && !emailInput;
  var isRegistrationForm = usernameInput && emailInput && passwordInput;

  if (!isLoginForm && !isRegistrationForm) {
    return; // Exit if not a user form
  }

  var form = document.querySelector("form");
  if (!form) return;

  // Add novalidate attribute to disable browser validation prompts
  form.setAttribute("novalidate", "");

  // Function to validate required fields
  function validateRequiredField(input) {
    var value = input.value.trim();

    // Remove both classes first
    input.classList.remove("is-valid", "is-invalid");

    if (value === "") {
      input.classList.add("is-invalid");
      return false;
    } else {
      input.classList.add("is-valid");
      return true;
    }
  }

  // Function to validate all fields
  function validateAllFields() {
    var isUsernameValid = validateRequiredField(usernameInput);
    var isPasswordValid = validateRequiredField(passwordInput);

    // Only validate email if it exists (registration form)
    var isEmailValid = true;
    if (emailInput) {
      isEmailValid = validateRequiredField(emailInput);
    }

    return isUsernameValid && isPasswordValid && isEmailValid;
  }

  // Real-time validation on input
  usernameInput.addEventListener("input", function () {
    validateRequiredField(usernameInput);
  });
  usernameInput.addEventListener("blur", function () {
    validateRequiredField(usernameInput);
  });

  // Only add email validation if email field exists
  if (emailInput) {
    emailInput.addEventListener("input", function () {
      validateRequiredField(emailInput);
    });
    emailInput.addEventListener("blur", function () {
      validateRequiredField(emailInput);
    });
  }

  passwordInput.addEventListener("input", function () {
    validateRequiredField(passwordInput);
  });
  passwordInput.addEventListener("blur", function () {
    validateRequiredField(passwordInput);
  });

  // Form submission handler - FIXED TO MATCH OTHER FORMS
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    event.stopPropagation();

    var isFormValid = validateAllFields();

    if (isFormValid) {
      form.submit(); // ✅ Submit the actual form just like other forms
    }
  });
});
