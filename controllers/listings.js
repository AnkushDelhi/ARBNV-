const Listing=require("../models/listings");

module.exports.index=async(req,res)=>{
        const allListings= await Listing.find({});
       res.render("listings/index.ejs",{allListings});
    
};


module.exports.renderForm=(req,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id)
    .populate({path:"reviews", populate:{
        path:"author",
    }})
    .populate("owner");
    if(!listing){
        req.flash("error","THE PLACE YOU FOUND IS DOES NOT EXIST");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}

module.exports.createListing=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing= new Listing(req.body.listing);
       newListing.owner=req.user._id;
       newListing.image={url , filename};
        await newListing.save();
        // for telling the user that your listing added
        req.flash("success","you added successfully");
        res.redirect("/Listings");
       
    };

module.exports.editListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    let originalImageUrl = listing.image.url;
   
    res.render("listings/edit.ejs",{listing , originalImageUrl});

};    

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
    let url=req.file.url;
    let filename=req.file.filename;
    listing.image={url , filename};
    await listing.save();
    }
    req.flash("success","YOUR INFORMATION IS UPDATED");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
   let deleteListing= await Listing.findByIdAndDelete(id);
     console.log(deleteListing); 
     req.flash("success","YOU DELETE YOUR CARD SUCCESSFULLY");
     res.redirect("/listings");
  };