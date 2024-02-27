
const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listings.js");

const DB_URL = process.env.ATLASDB_URL;


main().then(()=>{
    console.log("connect to db")
}).catch(err =>{
    console.log(err);
})

async function main(){
    //await mongoose.connect("mongodb://127.0.0.1:27017/roots")
    await mongoose.connect(DB_URL);
}


const initDB =async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({
        ...obj,
        owner:"65c45914bbe7871752f5f90a",
    }))
    await Listing.insertMany(initData.data);
    console.log("data was init");
};
initDB();