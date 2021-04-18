const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middlewares');
const Campground = require('../models/campground.js');
const Review = require('../models/review.js');

router.post("/", isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    console.dir(review.author);
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', 'You created a new Review!');
    res.redirect(`/campgrounds/${camp._id}`);
}));

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Deleted your review!');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;