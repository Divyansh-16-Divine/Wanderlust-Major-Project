const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const listings = require("../controllers/listings");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Search Route (MUST be before /:id routes to avoid conflicts)
router.get("/search", wrapAsync(listingController.searchListings));

// Index & Create Route
router
  .route("/")
  .get(wrapAsync(listingController.index)) // Index Route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  ); // Create Route

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Trending route
router.get("/trending", listings.trendingListings);

// Route to show listings by category
router.get("/category/:category", wrapAsync(listingController.showByCategory));

// Show, Update & Delete Route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing)) // Show Route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  ) // Update Route
  .delete(isLoggedIn, wrapAsync(listingController.destroyListing)); // Delete Route

// Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
