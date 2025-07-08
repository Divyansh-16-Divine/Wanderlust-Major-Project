if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/reviews.js");
const usersRouter = require("./routes/users.js");

const atlasUrl = process.env.ATLAS_DB_URL;
const localUrl = "mongodb://127.0.0.1:27017/wanderlust";
const port = process.env.PORT || 8080;

let dbUrl = localUrl; // Will be changed to Atlas if connection succeeds

async function connectToDatabase() {
  try {
    console.log("Trying to connect to MongoDB Atlas...");
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

startApp();

async function startApp() {
  await connectToDatabase();
  console.log("📦 Final DB URL used for sessions:", dbUrl);

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));
  app.engine("ejs", ejsMate);
  app.use(express.static(path.join(__dirname, "/public")));

  const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
  });

  store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE");
  });

  const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    },
  };

  app.use(session(sessionOptions));
  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
  });

  app.use("/listings", (req, res, next) => {
    console.log(`Listings route hit: ${req.method} ${req.path}`);
    next();
  });
  app.use("/listings", listingsRouter);
  app.use("/listings/:id/reviews", reviewsRouter);
  app.use("/", usersRouter);

  app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
  });

  app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    const message = err.message || "Something Went Wrong!";
    res.status(statusCode).render("error.ejs", { err: { ...err, message } });
  });

  app.listen(port, () => {
    console.log(`✅ Server is listening on port ${port}`);
  });
}
