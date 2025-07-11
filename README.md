# 🌍 Wanderlust — An Airbnb Clone

**Wanderlust** is a full-stack web application inspired by Airbnb. It enables users to browse, create, edit, and review vacation rental listings across the globe. Built using modern web technologies, it offers a seamless and responsive experience for both hosts and travelers.

---

## 🛠️ Tech Stack

### 🔹 Frontend
- HTML5, CSS3
- Bootstrap (or Tailwind CSS if used)
- JavaScript
- EJS (Embedded JavaScript Templates)

### 🔹 Backend
- Node.js
- Express.js

### 🔹 Database & Auth
- MongoDB with Mongoose
- Passport.js (Local Strategy)
- Express-Session & Connect-Mongo for session management

### 🔹 Cloud & APIs
- Cloudinary (image uploads)
- Mapbox (location maps & geocoding)

---

## ✨ Features

### 🏠 Listing Management
- Browse all property listings with title, price, and location
- View detailed listing pages with images, map, and description
- Authenticated users can:
  - Create new listings
  - Upload multiple images
  - Edit their own listings
  - Delete their own listings

### 🗺️ Location & Maps
- Interactive maps using Mapbox on listing detail pages
- Geocoding of addresses during listing creation

### 🔐 Authentication & Authorization
- User registration & login
- Password hashing with Passport.js
- Route protection for sensitive operations
- Only owners can modify or delete their listings/reviews

### 🖼️ Image Uploads
- Secure multi-image upload via Cloudinary
- Images displayed responsively on listing cards and detail pages

### 💬 Reviews & Ratings
- Leave reviews on listings as an authenticated user
- Edit or delete your own reviews
- Reviews are displayed with timestamps

### 📱 Responsive UI
- Fully responsive layout across devices
- Clean navigation and intuitive design

### 📣 Flash Messaging
- Feedback on login, errors, successful actions (e.g., "Listing created")

---


## 🔧 Installation & Setup

### ✅ Prerequisites
- Node.js & npm installed
- MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Cloudinary account
- Mapbox account (for geocoding and maps)


## 🧪 Sample User Flows

### 🧑‍💼 Host

1. Register or log in.
2. Click "New Listing".
3. Fill in details, upload images, submit.
4. Edit or delete your listings anytime.

### 🧳 Traveler

1. Browse listings on the home page.
2. Click any listing to view more details.
3. Leave a review if logged in.

---

## 🚀 Deployment

Deployed using **Render.com** with MongoDB Atlas and Cloudinary.

---

## 🙋‍♂️ Author

**Divyansh**
💼 GitHub: [@Divyansh-16-Divine](https://github.com/Divyansh-16-Divine)

---

## 🙏 Acknowledgements

* [Airbnb](https://www.airbnb.com/) for UI/UX inspiration
* [Cloudinary](https://cloudinary.com/)
* [Mapbox](https://www.mapbox.com/)
