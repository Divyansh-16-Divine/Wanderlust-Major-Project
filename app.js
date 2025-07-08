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

let dbUrl = atlasUrl;

mongoose.set("strictQuery", true); // Remove deprecation warnings

// ---------- MongoDB Connection ----------
async function connectToDatabase() {
  console.log("🔌 Trying to connect to MongoDB Atlas...");

  try {
    await mongoose.connect(atlasUrl, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
    });
    dbUrl = atlasUrl;
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    const isAtlasTLSIssue =
      err.message.includes("Could not connect to any servers") ||
      err.message.includes("tlsv1 alert internal error");

    console.log("❌ Atlas connection failed:");
    if (isAtlasTLSIssue) {
      console.log("🚫 Likely reason: IP not whitelisted in MongoDB Atlas.");
      console.log(
        "👉 Go to https://cloud.mongodb.com > Network Access > Add IP Address"
      );
    } else {
      console.log("🧨 Reason:", err.message);
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("➡️ Trying local MongoDB...");
      try {
        await mongoose.connect(localUrl);
        dbUrl = localUrl;
        console.log("✅ Connected to local MongoDB");
      } catch (localErr) {
        console.error("❌ Local MongoDB failed:", localErr.message);
        process.exit(1);
      }
    } else {
      console.error("❌ Production MongoDB Atlas connection failed");
      process.exit(1);
    }
  }
}

// ---------- Mongoose Events ----------
mongoose.connection.on("connected", () => {
  console.log("✅ Mongoose connected to MongoDB");
});
mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("❌ Mongoose disconnected");
});
mongoose.connection.on("reconnected", () => {
  console.log("✅ Mongoose reconnected");
});

// ---------- Graceful Shutdown ----------
function gracefulShutdown(signal) {
  console.log(`🛑 ${signal} received, shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log("✅ HTTP server closed");
      mongoose.connection.close(false, () => {
        console.log("✅ MongoDB connection closed");
        process.exit(0);
      });
    });
  } else {
    mongoose.connection.close(false, () => {
      console.log("✅ MongoDB connection closed");
      process.exit(0);
    });
  }
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

let server;

async function startApp() {
  await connectToDatabase();
  console.log("📦 DB URL used for session store:", dbUrl);

  // ---------- Express Setup ----------
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));
  app.engine("ejs", ejsMate);
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride("_method"));
  app.use(express.static(path.join(__dirname, "/public")));

  // ---------- Session Store ----------
  const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: { secret: process.env.SECRET || "devsecret" },
    touchAfter: 24 * 3600,
    ttl: 7 * 24 * 60 * 60,
  });

  store.on("error", (err) => {
    console.error("❗ Session store error:", err);
  });

  const sessionOptions = {
    store,
    secret: process.env.SECRET || "devsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  };

  app.use(session(sessionOptions));
  app.use(flash());

  // ---------- Passport Setup ----------
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

  // ---------- Routes ----------
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      dbStatus:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
  });

  app.get("/", (req, res) => {
    console.log("🏠 Home route hit");
    res.redirect("/listings");
  });

  app.use("/listings", (req, res, next) => {
    console.log(`🛬 Listings route hit: ${req.method} ${req.path}`);
    next();
  });

  app.use("/listings", listingsRouter);
  app.use("/listings/:id/reviews", reviewsRouter);
  app.use("/", usersRouter);

  // ---------- 404 Handler ----------
  app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
  });

  // ---------- General Error Handler ----------
  app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    const message = err.message || "Something Went Wrong!";
    console.error("❌ Express Error:", message);
    console.error(err.stack || err);

    const errorResponse =
      process.env.NODE_ENV === "production"
        ? { message: statusCode === 500 ? "Internal Server Error" : message }
        : { ...err, message };

    res.status(statusCode).render("error.ejs", { err: errorResponse });
  });

  // ---------- Start Server ----------
  server = app.listen(port, "0.0.0.0", () => {
    console.log(`✅ Server is listening on port ${port}`);
  });

  server.keepAliveTimeout = 120 * 1000;
  server.headersTimeout = 130 * 1000;
  server.timeout = 120 * 1000;

  process.on("uncaughtException", (err) => {
    console.error("❗ Uncaught Exception:", err);
    gracefulShutdown("UNCAUGHT_EXCEPTION");
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("❗ Unhandled Rejection at:", promise, "reason:", reason);
    gracefulShutdown("UNHANDLED_REJECTION");
  });
}

startApp().catch((err) => {
  console.error("❌ Failed to start application:", err);
  process.exit(1);
});
