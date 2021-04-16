const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');

const campgrounds = require('./routes/campgrounds.js');
const reviews = require('./routes/reviews.js');

mongoose.connect('mongodb://localhost:27017/campgrounds', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected!");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));



app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res) => {
    res.render('home');
});



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 400));
})

app.use((err, req, res, next) => {
    const { status = 500, msg } = err;
    // if (!err.message) err.message = 'Oh no!';
    res.status(status).render('error', { err });
});

app.listen(3000, () => {
    console.log("listening at port 3000!");
});