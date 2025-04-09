const express = require('express');
const crypto = require('crypto');
const cloudinary = require('../config/cloudinaryConfig');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Route to generate signature for Cloudinary upload
router.post('/signature', protect, (req, res) => {
  try {
    const { timestamp, public_id, folder } = req.body;
    const api_key = cloudinary.config().api_key;

    if (!timestamp || !public_id || !folder) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required parameters: timestamp, public_id, folder'
      });
    }

    const paramsToSign = {
      public_id,
      timestamp,
      api_key,
      folder
    };

    const sortedParams = Object.keys(paramsToSign)
      .sort()
      .map(key => `${key}=${encodeURIComponent(paramsToSign[key])}`)
      .join('&');

    const stringToSign = sortedParams + cloudinary.config().api_secret;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    return res.status(200).json({
      status: 'success',
      signature,
      api_key: cloudinary.config().api_key
    });
  } catch (error) {
    console.error('Error generating Cloudinary signature:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to generate signature'
    });
  }
});

module.exports = router;
