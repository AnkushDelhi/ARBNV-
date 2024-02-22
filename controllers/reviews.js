const Listing=require("../models/listings");
const Review=require("../models/review");

module.exports.createReview=async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
     newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","YOU REVIEW IS ADDED");
   res.redirect(`/listings/${listing.id}`);

};

module.exports.deleteReview=async(req,res)=>{
    let {id , reviewId} =req.params;
     // delete form listings // 
     await Listing.findByIdAndUpdate(id,{$pull:{reviews : reviewId}});
    // for delete the review in Review Model //
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","SUCCESSFULLY DELETE YOUR REVIEW");
    res.redirect(`/listings/${id}`);
 };

