const express = require('express');
const app = express();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/Expresserror.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const router = express.Router({mergeParams:true});
const Listing = require('../models/listing.js');
const { isLoggedIn,isReviewAuthor} = require('../middleware.js');
const reviewController=require("../controller/reviews.js");


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};


// Route to add a new review to a listing (CREATE Review)
router.post("/", validateReview,isLoggedIn, wrapAsync(reviewController.CreateReview));



//route to delete a review
router.delete("/:reviewId", // <-- Corrected path and removed extra parenthesis
    isLoggedIn,isReviewAuthor,wrapAsync(reviewController.DeleteReview)); 


module.exports = router;