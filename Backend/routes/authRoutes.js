const express = require('express');
const {  login } = require('../controllers/authController');

const { adminSignup } = require('../controllers/AdminauthController');





const router = express.Router();

// router.post('/signup', signup);
router.post('/login', login);

router.post('/adminSignup', adminSignup);

module.exports = router;
