const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync = require("../utiles/wrapAsync.js");
const ExpressError=require("../utiles/ExpressError.js");
const {reviewSchema } =require("../schema.js")
const Review=require("../models/review.js");
const Listing=require("../models/listings.js");
const { isLoggedIn , validateReview, isReviewAuthor } = require("../middleware.js");
const reviewControllers=require("../controllers/reviews.js");



//review 
router.post("/",isLoggedIn, validateReview ,
wrapAsync(reviewControllers.createReview));


 // review delete
 router.delete("/:reviewId",isLoggedIn,
    isReviewAuthor,
       wrapAsync(reviewControllers.deleteReview)
 );

 module.exports=router;