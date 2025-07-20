const express = require("express");
const router = express.Router(); // Create an Express router
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/Expresserror.js");
const { listingSchema } = require("../schema.js"); // Only listingSchema is needed here
const listing = require("../models/listing.js"); // <--- ADDED: Import the Listing model
const{isLoggedIn, isOwner}=require("../middleware.js");
const listingController=require("../controller/listings.js");
const multer  = require('multer');
const{storage}=require("../cloudConfig.js");
const upload = multer({storage});




// Joi Validation Middleware for listings
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
};

// Index Route: Show all listings,to save a new listing (CREATE)
router
.route("/")
.get(wrapAsync(listingController.index))
.post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.CreateNewListing)
);


// Route to add new listing (render form)
router.get("/new",isLoggedIn,listingController.RenderNewform);


// Route to find a listing by its id (Show Route),update and delete a listing
router
.route("/:id")
.get(wrapAsync(listingController.ShowListingByid))
.put(validateListing,isOwner, upload.single("listing[image]"), wrapAsync(listingController.UpdateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.DeleteListing));



// Route to edit a listing (render edit form)
router.get("/:id/edit",isLoggedIn ,isOwner,wrapAsync(listingController.RenderEditform));



module.exports = router; // Export the router
