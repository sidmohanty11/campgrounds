const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const Campground = require('../models/campground.js');
const { isLoggedIn, isAuthor, validateCamp } = require('../middlewares');

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
    res.render('campgrounds/new');
}));

router.get('/:id', catchAsync(async (req, res) => {
    const camp = await (await Campground.findById(req.params.id).populate('reviews').populate('author'));
    if (!camp) {
        req.flash('error', 'Cannot find that Campground! :(');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { camp });
}));

router.post('/', isLoggedIn, validateCamp, catchAsync(async (req, res) => {
    //if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that Campground! :(');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, isAuthor, validateCamp, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated the Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
    // res.send("it worked");
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permissions!');
        return res.redirect(`/campgrounds/${id}`);
    }
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the Campground!');
    res.redirect('/campgrounds')
}));

module.exports = router;