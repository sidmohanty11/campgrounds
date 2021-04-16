const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Campground = require('../models/campground.js');
const { campSchema } = require('../joischema.js');

const validateCamp = (req, res, next) => {
    const { error } = campSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render('campgrounds/index', { campgrounds });
}));

router.get('/new', catchAsync(async (req, res) => {
    res.render('campgrounds/new');
}));

router.get('/:id', catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { camp });
}));

router.post('/', validateCamp, catchAsync(async (req, res) => {
    //if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect('/campgrounds');
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', validateCamp, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`);
    // res.send("it worked");
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}));

module.exports = router;