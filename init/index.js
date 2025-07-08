if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const atlasUrl = process.env.ATLAS_DB_URL;
const localUrl = "mongodb://127.0.0.1:27017/wanderlust";

let dbUrl = localUrl; // default

async function connectToDatabase() {
  try {
    console.log("🌐 Trying to connect to MongoDB Atlas...");
    await mongoose.connect(atlasUrl);
    dbUrl = atlasUrl;
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ Failed to connect to Atlas:", err.message);
    console.log("➡️ Falling back to local MongoDB...");
    try {
      await mongoose.connect(localUrl);
      console.log("✅ Connected to local MongoDB");
    } catch (localErr) {
      console.error("❌ Failed to connect to local MongoDB as well.");
      process.exit(1);
    }
  }
}

const initDB = async () => {
  await Listing.deleteMany({});

  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: "686504dc4c15360a2524d79f", // replace with a valid ObjectId if needed
  }));

  await Listing.insertMany(listingsWithOwner);

  console.log("✅ Data was initialized");
};

async function start() {
  await connectToDatabase();
  await initDB();
  mongoose.connection.close(); // Optional: close DB connection when done
}

start();
