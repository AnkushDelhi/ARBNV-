// to access the .env with the help of dotenv
if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const path=require("path");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const User=require("./models/user.js");
const LocalStrategy=require("passport-local");

const ExpressError=require("./utiles/ExpressError.js");

const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const dbUrl=process.env.ATLASDB_URL;


// for online session 
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600 ,
})

store.on("error",()=>{
    console.log("ERROR in mongodb store",err);
})

// creating our session
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
    }
}



app.use(session(sessionOptions));
app.use(flash());
 
// for every single request we init a password middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for notification to add a new listing
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

/* creating a fakeuser
app.get("/demoUser",async(req,res)=>{
let fakeUser= new User({
  email:"huddaankush8Agmail.com",
  username:"Ankush",
});
   //register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique.  
 const registerUser= await User.register(fakeUser,"Helloword");
       res.send(registerUser);
})
*/




main().then(()=>{
    console.log("connect to db")
}).catch(err =>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);






app.all("*",(req,res,next)=>{
     next( new ExpressError(404,"page not found"));
    
})

/*for error handing*/

app.use((err,req,res,next)=>{
   let{statusCode=505,message="something went Wrong"}=err;
   res.render("error.ejs",{err});
})


app.listen(8080,()=>{
    console.log("server is listening to the port");
})