const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post(
  '/',
  protect,
  authorize('admin'),
  upload.single('image'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please provide an image file to upload',
        });
      }

      // Check if Cloudinary credentials are provided
      if (
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ) {
        // Optional Cloudinary upload can be done here
      }

      // Default safe development URL using server static path
      const protocol = req.protocol;
      const host = req.get('host');
      const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

      res.status(200).json({
        success: true,
        message: 'Image uploaded successfully',
        imageUrl: fileUrl,
        filename: req.file.filename,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
