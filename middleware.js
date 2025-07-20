const Listing=require("./models/listing.js");
const Review=require("./models/review.js");



module.exports = {
  isLoggedIn: (req, res, next) => {
    console.log(req.user);
    if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl;
      req.flash('error', "you must be logged in");
      return res.redirect("/login");
    }
    next();
  },

  saveRedirectUrl: (req, res, next) => {
    if (req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
  },

  isOwner:async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
      req.flash("error","Permission Denied! Only Owner can Edit or Delete");
      return res.redirect(`/listings/${id}`);
    }
    next();
  },
  isReviewAuthor:async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      req.flash("error","Permission Denied! Only  Review Owner can Delete");
      return res.redirect(`/listings/${id}`);
    }
    next();
  }
};
