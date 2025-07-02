const { cloudinary } = require("../cloudConfig");

module.exports = async function deleteCloudinaryImage(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Error deleting image from Cloudinary:", err);
  }
};
