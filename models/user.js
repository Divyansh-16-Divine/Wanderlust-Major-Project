const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const Review = require("./review");
const Listing = require("./listing");

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

userSchema.plugin(passportLocalMongoose);

// ✅ Middleware to delete reviews and listings when a user is deleted
userSchema.post("findOneAndDelete", async function (deletedUser) {
  if (deletedUser) {
    // Delete all reviews by the user
    await Review.deleteMany({ author: deletedUser._id });

    // Find all listings owned by the user
    const listings = await Listing.find({ owner: deletedUser._id });

    // Delete each listing (to trigger listingSchema middleware and remove their reviews)
    for (let listing of listings) {
      await listing.deleteOne();
    }

    console.log(
      `Deleted user ${deletedUser.username}, their reviews and listings.`
    );
  }
});

module.exports = mongoose.model("User", userSchema);
