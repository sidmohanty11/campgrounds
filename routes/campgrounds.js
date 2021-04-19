const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const campgrounds = require('../controllers/camps');
const { isLoggedIn, isAuthor, validateCamp } = require('../middlewares');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCamp, catchAsync(campgrounds.showPage));

router.get('/new', isLoggedIn, catchAsync(campgrounds.getNew));

router.route('/:id')
    .get(catchAsync(campgrounds.createNew))
    .put(isLoggedIn, isAuthor, validateCamp, catchAsync(campgrounds.updateCamp))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm));

module.exports = router;