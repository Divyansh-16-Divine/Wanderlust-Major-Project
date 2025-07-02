const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.addReview = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();

    listing.reviews.push(newReview._id);
    await listing.save();
    req.flash("success", "Review Added!");

    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params;

  // Remove reference from the listing
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

  // Delete the review document
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");

  res.redirect(`/listings/${id}`);
};
