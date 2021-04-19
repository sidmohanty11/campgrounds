const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middlewares');
const Campground = require('../models/campground.js');
const Review = require('../models/review.js');
const reviews = require('../controllers/reviews')

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;