var mongoose = require('mongoose'),Schema=mongoose.Schema;
var slugify = require('slugify')

var RetailerSchema = new Schema({
    dateAdded: {type:Date, default: Date.now},
    addedBy: { type: Schema.Types.ObjectId, ref: 'user' },
    name:{type: String,required: true},
    slug:{type: String,required: true}
});
var retailer=mongoose.model('retailer',RetailerSchema);

exports.addRetailer=function(retailerReq,loggedUser){
    var newRetailer=new retailer();
    newRetailer.set('addedBy',loggedUser);
    newRetailer.set('name',retailerReq.name);
    newRetailer.set('slug',slugify(retailerReq.name,{
      replacement: '-',    // replace spaces with replacement
      remove: null,        // regex to remove characters
      lower: true          // result in lower case
    }));

    return new Promise((resolve,reject)=>{
        newRetailer.save(function(err){
           if(err){
               reject({err});
           }
           else{
               resolve({success:'Retailer Inserted Successfuly!'});
           }
       });
     })
}


exports.getAllRetailers=function(){
    return new Promise((resolve,reject)=>{
        retailer.find()
        .populate('addedBy')
        .exec(function(err,doc){
             if(err){
                reject({err})
             }else{
                resolve(doc);
             }
          });
     })
}

exports.getAllRetailersByRetailers=function(retailers){
   return new Promise((resolve,reject)=>{
      retailer.find({_id:{$in:retailers}})
      .populate('addedBy')
        .exec(function(err,doc){
             if(err){
                reject({err})
             }else{
                resolve(doc);
             }
          });
   })
}

exports.getRetailerById=function(id){
    return new Promise((resolve,reject)=>{
    retailer.findOne({_id:id})
       .populate('addedBy')
       .exec(function(err,doc){
            if(err){
               reject({err})
            }else{
               resolve(doc);
            }
         });
    })
 }


 exports.updateRetailer=function(retailerReq){
    retailerReq.slug=slugify(retailerReq.name,{
      replacement: '-',    // replace spaces with replacement
      remove: null,        // regex to remove characters
      lower: true          // result in lower case
    })
    return new Promise((resolve,reject)=>{
        retailer.findOneAndUpdate(
          {_id:retailerReq._id},
          retailerReq,
          {upsert:false},
          (err,doc)=>{
             if (err){
                reject({ err });
             } 
             else{
                resolve(doc)
             }
          })
    })
 }
 
 
 exports.removeRetailer=function(id){
    return new Promise((resolve,reject)=>{
       retailer.deleteOne({_id:id})
       .exec(function(err){
            if(err){
               reject({err})
            }else{
               resolve({msg:"deleted successfully"});
            }
         });
    })
 }


 exports.getRetailerBySlug=function(slug){
   return new Promise((resolve,reject)=>{
   retailer.findOne({slug:slug})
      .exec(function(err,doc){
           if(err){
              reject({err})
           }else{
              resolve(doc);
           }
        });
   })
}