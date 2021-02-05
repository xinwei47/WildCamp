const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers')

// connect to mongoDB
mongoose.connect('mongodb://localhost:27017/wild-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


// seeding the database

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            author: '601a37c8ac98221fb5e7a601',
            title: `${sample(descriptors)} ${sample(places)}`,
            price: Math.floor(Math.random() * 30),
            images: [
                {
                    filename: 'WildCamp/blake-wisz-TcgASSD5G04-unsplash_mpkacu',
                    path: 'https://res.cloudinary.com/dmgkwi4uo/image/upload/v1612501277/WildCamp/blake-wisz-TcgASSD5G04-unsplash_mpkacu.jpg'
                },
                {
                    filename: 'WildCamp/christopher-jolly-gcCcIy6Fc_M-unsplash_jtuhdf',
                    path: 'https://res.cloudinary.com/dmgkwi4uo/image/upload/v1612501294/WildCamp/christopher-jolly-gcCcIy6Fc_M-unsplash_jtuhdf.jpg'
                },
                {
                    filename: 'WildCamp/hb3ihxrh2ai5qbqetjso',
                    path: 'https://res.cloudinary.com/dmgkwi4uo/image/upload/v1612500895/WildCamp/hb3ihxrh2ai5qbqetjso.jpg'
                },
            ],
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.Veritatis cupiditate, quos impedit quis iste optio ullam eveniet minus autem voluptatum sit inventore aliquam quo nobis blanditiis molestiae magnam eius repellendus.'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
