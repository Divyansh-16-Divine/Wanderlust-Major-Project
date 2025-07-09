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

// Add this right after your requires at the top
console.log("🚀 Starting app with environment:");
console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`   PORT: ${process.env.PORT}`);
console.log(`   ATLAS_DB_URL exists: ${!!process.env.ATLAS_DB_URL}`);
console.log(`   Process ID: ${process.pid}`);
console.log(`   Node Version: ${process.version}`);
console.log(`   Memory Usage:`, process.memoryUsage());

mongoose.set("strictQuery", true); // Remove deprecation warnings

// ---------- MongoDB Connection ----------
async function connectToDatabase() {
  console.log("🔌 Trying to connect to MongoDB Atlas...");

  try {
    await mongoose.connect(atlasUrl, {
      maxPoolSize: 5, // Reduced from 10 to save memory
      minPoolSize: 1, // Add minimum pool size
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      maxIdleTimeMS: 10000, // Close idle connections after 10 seconds
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
  // Don't exit on connection errors in production
  if (process.env.NODE_ENV === "production") {
    console.log("🔄 Will attempt to reconnect...");
  }
});

mongoose.connection.on("disconnected", () => {
  console.log("❌ Mongoose disconnected");
  // Try to reconnect in production
  if (process.env.NODE_ENV === "production") {
    console.log("🔄 Attempting to reconnect in 5 seconds...");
    setTimeout(() => {
      connectToDatabase().catch((err) => {
        console.error("❌ Reconnection failed:", err);
      });
    }, 5000);
  }
});

mongoose.connection.on("reconnected", () => {
  console.log("✅ Mongoose reconnected");
});

// ---------- Graceful Shutdown ----------
let isShuttingDown = false;

async function gracefulShutdown(signal) {
  if (isShuttingDown) {
    console.log("⚠️  Shutdown already in progress...");
    return;
  }

  isShuttingDown = true;
  console.log(`🛑 ${signal} received, shutting down gracefully...`);

  try {
    // Close server first
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((err) => {
          if (err) {
            console.error("❌ Error closing server:", err);
            reject(err);
          } else {
            console.log("✅ HTTP server closed");
            resolve();
          }
        });
      });
    }

    // Then close database connection
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("✅ MongoDB connection closed");
    }

    console.log("👋 Graceful shutdown completed");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during graceful shutdown:", err);
    process.exit(1);
  }
}

// Handle different termination signals
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

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

  // Add trust proxy setting for Render (IMPORTANT!)
  app.set("trust proxy", 1); // Trust first proxy (Render's load balancer)

  const sessionOptions = {
    store,
    secret: process.env.SECRET || "devsecret",
    resave: false,
    saveUninitialized: false, // Changed from true to false for better security
    cookie: {
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Add sameSite
    },
    name: "sessionId", // Custom session name (optional but recommended)
  };

  // Add debugging for sessions in development
  if (process.env.NODE_ENV !== "production") {
    sessionOptions.cookie.secure = false; // Ensure cookies work in development
  }

  app.use(session(sessionOptions));
  app.use(flash());

  // Add session debugging middleware (temporary - remove after fixing)
  app.use((req, res, next) => {
    console.log(`📊 Session Debug - ${req.method} ${req.path}:`);
    console.log(`   Session ID: ${req.sessionID}`);
    console.log(`   User: ${req.user ? req.user.username : "Not logged in"}`);
    console.log(`   Cookie Secure: ${sessionOptions.cookie.secure}`);
    next();
  });

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
  app.get("/health", async (req, res) => {
    console.log("🏥 Health check requested"); // Add this debug line

    try {
      // Basic service health
      const healthStatus = {
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        port: port, // Add port info
        env: process.env.NODE_ENV,
        checks: {
          server: "healthy",
          database: "checking...",
        },
      };

      // Check MongoDB connection state first
      const dbState = mongoose.connection.readyState;
      console.log(`   Database state: ${dbState}`); // Add debug

      if (dbState !== 1) {
        healthStatus.checks.database = "disconnected";
        healthStatus.status = "UNHEALTHY";
        console.log("   ❌ Database not connected, returning 503");
        return res.status(503).json(healthStatus);
      }

      // Perform actual database operation to verify connectivity
      try {
        // Use admin command to ping the database
        await mongoose.connection.db.admin().ping();
        healthStatus.checks.database = "connected";

        // Optional: Add memory usage info
        const memUsage = process.memoryUsage();
        healthStatus.memory = {
          heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)} MB`,
          rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
        };

        console.log("   ✅ Health check passed, returning 200");
        return res.status(200).json(healthStatus);
      } catch (dbError) {
        console.error("❌ Health check database ping failed:", dbError.message);
        healthStatus.checks.database = "error";
        healthStatus.status = "UNHEALTHY";
        healthStatus.error = dbError.message;
        return res.status(503).json(healthStatus);
      }
    } catch (error) {
      console.error("❌ Health check failed:", error);
      return res.status(503).json({
        status: "ERROR",
        timestamp: new Date().toISOString(),
        error: error.message,
      });
    }
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
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
    console.error(`❌ 404 Page Not Found: ${fullUrl}`);
    console.error(`   Method: ${req.method}`);
    console.error(`   IP: ${req.ip}`);
    // Only pass generic message to user, URL is only in console
    next(new ExpressError(404, "Page Not Found!"));
  });

  // ---------- General Error Handler ----------
  app.use((err, req, res, next) => {
    let { statusCode = 500 } = err;
    let message = err.message || "Something Went Wrong!";
    const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    // Convert MongoDB/Mongoose errors to user-friendly messages
    if (err.name === "CastError" && err.kind === "ObjectId") {
      // Invalid ObjectId - treat as 404
      statusCode = 404;
      message = "Page Not Found!";
    } else if (err.name === "ValidationError") {
      // Mongoose validation error
      statusCode = 400;
      message = "Invalid Request";
    } else if (err.code === 11000) {
      // MongoDB duplicate key error
      statusCode = 400;
      message = "Duplicate Entry";
    }

    // All detailed logging only goes to console, not to user
    console.error(
      `❌ Express Error [${statusCode}]: ${err.message || message}`
    );
    console.error(`   URL: ${fullUrl}`);
    console.error(`   Method: ${req.method}`);
    console.error(`   IP: ${req.ip}`);
    console.error(`   Error Type: ${err.name}`);
    if (req.body && Object.keys(req.body).length > 0) {
      console.error(`   Body:`, req.body);
    }
    console.error(err.stack || err);

    // In production, only show generic message to user
    const errorResponse =
      process.env.NODE_ENV === "production"
        ? { message: statusCode === 500 ? "Internal Server Error" : message }
        : { ...err, message };

    res.status(statusCode).render("error.ejs", { err: errorResponse });
  });

  // ---------- Start Server ----------
  server = app.listen(port, "0.0.0.0", () => {
    console.log(`✅ Server is listening on 0.0.0.0:${port}`);
    console.log(`📍 Health check endpoint: http://localhost:${port}/health`);
  });

  server.keepAliveTimeout = 120 * 1000;
  server.headersTimeout = 130 * 1000;
  server.timeout = 120 * 1000;

  process.on("uncaughtException", (err) => {
    console.error("❗ Uncaught Exception:", err);
    // Log the error but try to continue in production
    if (process.env.NODE_ENV === "production") {
      console.error("🔄 Attempting to recover from uncaught exception...");
      // Give the app a chance to recover
      setTimeout(() => {
        console.error("❌ Unable to recover, exiting...");
        process.exit(1);
      }, 5000);
    } else {
      process.exit(1);
    }
  });

  process.on("unhandledRejection", (reason, promise) => {
    console.error("❗ Unhandled Rejection at:", promise, "reason:", reason);
    // In production, log but don't exit immediately
    if (process.env.NODE_ENV !== "production") {
      process.exit(1);
    }
  });
}

startApp().catch((err) => {
  console.error("❌ Failed to start application:", err);
  process.exit(1);
});
