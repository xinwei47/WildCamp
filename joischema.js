const Joi = require('joi');

module.exports.campgroundJoiSchema = Joi.object({
    title: Joi.string().max(50).alphanum().required(),
    location: Joi.string().required(),
    price: Joi.number().min(0).required(),
    description: Joi.string().min(20).required(),
    image: Joi.string().required()
})

// module.exports.campgroundJoiSchema = Joi.object({
//     campground: Joi.object({
//         title: Joi.string().max(50).alphanum().required(),
//         location: Joi.string().required(),
//         price: Joi.number().min(0).required(),
//         description: Joi.string().min(20).required(),
//         image: Joi.string().required()
//     }).required()
// });

module.exports.reviewJoiSchema = Joi.object({
    rating: Joi.number().min(1).max(5),
    body: Joi.string()
})
