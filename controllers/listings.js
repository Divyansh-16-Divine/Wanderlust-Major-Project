const Listing = require("../models/listing");
const deleteCloudinaryImage = require("../utils/deleteCloudinaryImage");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// GET /listings
module.exports.index = async (req, res) => {
  let allListings = await Listing.find({}).populate("owner");

  // 🔥 Filter out listings with deleted owners
  allListings = allListings.filter((listing) => listing.owner);

  res.render("listings/index.ejs", { allListings });
};

// GET /listings/new
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// GET /listings/:id
module.exports.showListing = async (req, res) => {
  let { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "The Listing you searched for does not exist!");
    return res.redirect("/listings");
  }

  // 🔥 Filter out reviews with deleted authors
  listing.reviews = listing.reviews.filter((review) => review.author);

  // ✅ Track unique views by logged-in users
  if (req.user && !listing.viewers.includes(req.user._id)) {
    listing.viewers.push(req.user._id);
    listing.views += 1;
    await listing.save();
  }

  res.render("listings/show.ejs", { listing });
};

// POST /listings
module.exports.createListing = async (req, res, next) => {
  const { listing } = req.body;

  // Handle empty category: fallback to "Rooms"
  if (!listing.category || listing.category.trim() === "") {
    listing.category = "Rooms";
  }

  const newListing = new Listing(listing);
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  // Optional: enable if using geocoding
  // const geoData = await geocodingClient.forwardGeocode({ query: listing.location, limit: 1 }).send();
  // newListing.geometry = geoData.body.features[0].geometry;

  await newListing.save();

  req.flash("success", "New Listing Created Successfully!");
  res.redirect("/listings");
};

// GET /listings/:id/edit
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "The Listing you're trying to edit does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// PUT /listings/:id
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const { listing } = req.body;

  if (!listing.category || listing.category.trim() === "") {
    listing.category = "Rooms"; // Default fallback
  }

  const existingListing = await Listing.findById(id);

  if (!existingListing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  existingListing.set(listing);

  if (req.file) {
    // Delete old image from Cloudinary
    if (existingListing.image && existingListing.image.filename) {
      await deleteCloudinaryImage(existingListing.image.filename);
    }

    // Save new image
    existingListing.image = {
      url: req.file.path,
      filename: req.file.filename,
    };
  }

  await existingListing.save();

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${existingListing._id}`);
};

// DELETE /listings/:id
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Cannot delete - listing not found!");
    return res.redirect("/listings");
  }

  if (listing.image && listing.image.filename) {
    await deleteCloudinaryImage(listing.image.filename);
  }

  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.trendingListings = async (req, res) => {
  const trendingListings = await Listing.find({
    category: { $ne: "Others" },
  })
    .sort({ views: -1 })
    .limit(10); // adjust this number as needed

  res.render("listings/trending.ejs", { trendingListings });
};

module.exports.showByCategory = async (req, res) => {
  const { category } = req.params;

  // Properly capitalize each word (e.g., "iconic cities" -> "Iconic Cities")
  const formattedCategory = category
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // 🔥 Special case: Trending category
  if (formattedCategory === "Trending") {
    let trendingListings = await Listing.find({})
      .sort({ views: -1 })
      .limit(12)
      .populate("owner");

    // Remove listings with deleted owners
    trendingListings = trendingListings.filter((listing) => listing.owner);

    return res.render("listings/category.ejs", {
      listings: trendingListings,
      category: "Trending",
    });
  }

  // 🔥 Normal category listings
  let listings = await Listing.find({ category: formattedCategory }).populate(
    "owner"
  );

  // Remove listings with deleted owners
  listings = listings.filter((listing) => listing.owner);

  res.render("listings/category.ejs", {
    listings,
    category: formattedCategory,
  });
};

module.exports.searchListings = async (req, res) => {
  try {
    const { q: searchQuery, sort, category, price } = req.query;

    let query = {};

    // Text search across multiple fields
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { location: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price filter
    if (price) {
      if (price.includes("-")) {
        const [min, max] = price.split("-").map(Number);
        if (max) {
          query.price = { $gte: min, $lte: max };
        } else {
          query.price = { $gte: min };
        }
      } else if (price.includes("+")) {
        const min = parseInt(price.replace("+", ""));
        query.price = { $gte: min };
      }
    }

    let results = await Listing.find(query);

    // Sorting
    switch (sort) {
      case "price-low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Keep original order for relevance
        break;
    }

    res.render("listings/search", {
      searchQuery: searchQuery || "",
      results,
      filters: { sort, category, price },
      currentUser: req.user || null, // ADD THIS LINE
    });
  } catch (error) {
    console.error("Search error:", error);
    req.flash("error", "Search failed. Please try again.");
    res.render("listings/search", {
      searchQuery: req.query.q || "",
      results: [],
      filters: {},
      currentUser: req.user || null, // ADD THIS LINE TOO
    });
  }
};
