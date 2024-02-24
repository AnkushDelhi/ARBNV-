const mongoose=require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js");

const listingSchema = new Schema({
    title :{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    image:{
        url:String,
        filename:String,
    },

    location:String,
    country:String,
    price:Number,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        },
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    caategory:{
               type:String,
               enum:["Rooms","Iconic Cities","Mountains" , "Castles" , "Amazing Pools" , "Camping" , "Farms" , "SnowFall Area" ],
               require:true,
    }

   
})

// A post middleware which work when listing is delete and this middleware delete the review posted by the same listing
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
  await Review.deleteMany({_id:{$in : listing.reviews}})
    }
}) 

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;