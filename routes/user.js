const express=require("express");
const router = express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utiles/wrapAsync");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js")
const userControllers=require("../controllers/users.js")



router.route("/signUp")
.get(userControllers.renderSignUpForm)     // get -signUp
.post(wrapAsync(userControllers.signup));     // Post Signup

router.route("/Login")
.get(userControllers.renderLogInForm)         //Log in (get)
.post(
saveRedirectUrl,
passport.authenticate('local',             // Post Route Log in'
 { failureRedirect: '/login' , failureFlash:true }),
 userControllers.LogIn);



// for LogOut
router.get("/Logout",userControllers.LogOut);

module.exports=router;