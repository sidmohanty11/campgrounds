const { campSchema } = require('./joischema');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');
const { reviewSchema } = require('./joischema.js');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must Login!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCamp = (req, res, next) => {
    const { error } = campSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permissions!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permissions!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}