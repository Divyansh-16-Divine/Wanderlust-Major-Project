const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

module.exports.isLoggedIn = (req, res, next) => {
  console.log("🔒 IsLoggedIn middleware called");
  console.log("   Path:", req.originalUrl);
  console.log("   User:", req.user ? req.user.username : "No user");
  console.log("   IsAuthenticated:", req.isAuthenticated());
  console.log("   Session ID:", req.session.id);
  console.log("   Session passport:", req.session.passport);

  if (!req.isAuthenticated()) {
    // Store the URL they were trying to access
    req.session.redirectUrl = req.originalUrl;
    console.log(
      "   ❌ Not authenticated, saving redirect URL:",
      req.originalUrl
    );

    // Force session save before redirect
    req.session.save((err) => {
      if (err) {
        console.error("   Session save error:", err);
      }
      req.flash("error", "You must be logged in to perform this action!");
      return res.redirect("/login");
    });
  } else {
    console.log("   ✅ User is authenticated, proceeding");
    next();
  }
};

module.exports.saveRedirectUrl = (req, res, next) => {
  console.log("🔗 SaveRedirectUrl middleware");
  console.log("   Session redirectUrl:", req.session.redirectUrl);
  console.log("   Session ID:", req.session.id);

  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    console.log("   ✅ Saved to res.locals:", res.locals.redirectUrl);

    // Clear it from session after using it
    delete req.session.redirectUrl;

    // Save session after modification
    req.session.save((err) => {
      if (err) {
        console.error("   Session save error after clearing redirectUrl:", err);
      }
      next();
    });
  } else {
    console.log("   No redirectUrl in session");
    next();
  }
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  console.log("🏠 IsOwner check for listing:", id);
  console.log("   Current user:", req.user ? req.user.username : "No user");

  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  console.log("   Listing owner:", listing.owner);
  console.log("   Current user ID:", req.user ? req.user._id : "No user");

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have permission to perform this action!");
    return res.redirect(`/listings/${id}`);
  }

  console.log("   ✅ User is owner");
  next();
};

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    console.error("❌ Listing validation error:", error.details);
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    console.error("❌ Review validation error:", error.details);
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params; // `id` is the listing ID
  console.log("💬 IsReviewAuthor check");
  console.log("   Review ID:", reviewId);
  console.log("   Current user:", req.user ? req.user.username : "No user");

  const review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  console.log("   Review author:", review.author);
  console.log("   Current user ID:", req.user ? req.user._id : "No user");

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to perform this action!");
    return res.redirect(`/listings/${id}`);
  }

  console.log("   ✅ User is review author");
  next();
};
