const Listing = require('../models/listing.js');
const Review = require("../models/review.js");

module.exports.CreateReview=async (req, res) => {
    const listingData = await Listing.findById(req.params.id);
    if (!listingData) {
        throw new ExpressError(404, "Listing not found to add review!");
    }
    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);

    listingData.reviews.push(newReview);
    await newReview.save();
    await listingData.save();

    console.log("New review saved successfully!");
    req.flash("success","review saved successfully!");
    res.redirect(`/listings/${listingData._id}`);
};


module.exports.DeleteReview=async(req,res)=>{
        let {id,reviewId} = req.params;
        
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","review deleted successfully!");
        res.redirect(`/listings/${id}`);
};