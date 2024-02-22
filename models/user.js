const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");

const userSchema=new Schema({
    email:{
          type:String,
          required:true,
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);

//passportLocalMongoose Automatically create a username and password for use and also do the hash salt for password 