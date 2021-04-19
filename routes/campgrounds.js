const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync.js');
const campgrounds = require('../controllers/camps');
const { isLoggedIn, isAuthor, validateCamp } = require('../middlewares');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCamp, catchAsync(campgrounds.showPage));

router.get('/new', isLoggedIn, catchAsync(campgrounds.getNew));

router.route('/:id')
    .get('/:id', catchAsync(campgrounds.createNew))
    .put('/:id', isLoggedIn, isAuthor, validateCamp, catchAsync(campgrounds.updateCamp))
    .delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCamp));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editForm));

module.exports = router;