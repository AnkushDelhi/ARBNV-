const express=require("express");
const router = express.Router();
const { listingSchema ,reviewSchema } = require("../schema.js");
const wrapAsync = require("../utiles/wrapAsync.js");
const Listing=require("../models/listings.js");
const Review=require("../models/review.js");
const ExpressError = require("../utiles/ExpressError.js");
const { isLoggedIn,isOwner } = require("../middleware.js");
const listingControllers=require("../controllers/listings.js");
const {validateListing}=require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")

const upload = multer({storage});




router.route("/")
.get(wrapAsync(listingControllers.index))      //index route
.post(isLoggedIn,                                   //create route    
upload.single('listing[image]'),  
validateListing,                      
wrapAsync( listingControllers.createListing));
    


//new Route
router.get("/new",isLoggedIn,(listingControllers.renderForm));
  
 router.route("/:id")
 .get(wrapAsync(listingControllers.showListing))     // show route
 .put(isLoggedIn,
    isOwner,
    upload.single('listing[image]'), 
    validateListing,             //Update Route
 wrapAsync(listingControllers.updateListing))
 .delete(isLoggedIn,isOwner,
wrapAsync(listingControllers.deleteListing));         //delete Route



// edit route
router.get("/:id/edit",isLoggedIn,isOwner,
wrapAsync(listingControllers.editListing));

// HOME ROUTE
router.get("/home",isLoggedIn,wrapAsync(listingControllers.renderHome));




module.exports=router;