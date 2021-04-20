const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('../models/campground.js');
const cities = require('./cities.js');
const { places, descriptors } = require('./seedHelpers.js');

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '607afdfb64144345a418704e',
            location: `${cities[random].name}, ${cities[random].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/djk8lztrc/image/upload/v1618898954/CampGrounds/vxgokwq03wweqp12cndt.jpg',
                    filename: 'CampGrounds/vxgokwq03wweqp12cndt'
                },
                {
                    url: 'https://res.cloudinary.com/djk8lztrc/image/upload/v1618898969/CampGrounds/qgizba45msdiw8haayah.jpg',
                    filename: 'CampGrounds/qgizba45msdiw8haayah'
                }
            ],
            description: 'kjaldsbgjaeldgnjgbanbsjdnfdiashfljansfjlafanjlasnfjobqujfnasjgbuoasfbjasbfjlasbgjlasbGJLAGVBUJASBfagbuojaslngjlasbgILAJKGNjlgbjalgbjabsgajBGJLKVAN',
            price
        });

        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});