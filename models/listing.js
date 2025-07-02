const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,

  category: {
    type: String,
    enum: [
      "Rooms",
      "Iconic Cities",
      "Hill Stations",
      "Luxury Castles",
      "Amazing Pools",
      "Farms",
      "Campsites",
      "Arctic",
      "Beaches",
      "Others",
    ],
    default: "Rooms",
  },

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
    },
  },

  views: {
    type: Number,
    default: 0,
  },

  viewers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// ✅ When a listing is deleted, delete all associated reviews
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log(`Deleted reviews for listing: ${listing.title}`);
  }
});

module.exports = mongoose.model("Listing", listingSchema);
