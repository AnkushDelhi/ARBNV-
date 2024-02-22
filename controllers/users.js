
const User=require("../models/user");

module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
 }

module.exports.signup=async(req,res)=>{
    try{
        let {username , password , email} =req.body;
        const newUser=new User({username, email});
        const registerUser=await User.register(newUser,password);
        console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","YOU SIGNUP SUCCESSFULLY");
            res.redirect("/listings");
        })
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signUp");
    }
 
}

module.exports.renderLogInForm=(req,res)=>{
    res.render("users/login.ejs");
};


module.exports.LogIn=async(req,res)=>{
    req.flash("success","You Logged In Successfully");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
   };


   module.exports.LogOut=(req,res,next)=>{
    // A passport function (req.logout) which is used to logout user from website and its take a callback
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","YOU ARE LOGOUT SUCCESSFULLY");
        res.redirect("/listings");
    })
}