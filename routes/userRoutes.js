const express = require('express');
const { getProfileDetails, updateProfileDetails, uploadProfileImage } = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/multer');

const router = express.Router();

router.get('/profile-details', authMiddleware, getProfileDetails);
router.put('/profile-details', authMiddleware, updateProfileDetails);
router.post('/upload-profile-image', authMiddleware, upload.single('profileImage'), uploadProfileImage);

module.exports = router;
