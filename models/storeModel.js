var mongoose = require('mongoose'),Schema=mongoose.Schema;

var StoreSchema = new Schema({
    dateAdded: {type:Date, default: Date.now},
    addedBy: { type: Schema.Types.ObjectId, ref: 'user' },
    name:{type: String,required: true},
    storeNumber:{type: String,required: true},
    storeId:String,
    _group:{ type: Schema.Types.ObjectId, ref: 'circularGroup' },
    _retailer:{type: Schema.Types.ObjectId, ref: 'retailer'},
    address1:{type: String,required: true},
    address2:String,
    city:{type: String,required: true},
    state:{type: String,required: true},
    zip:Number,
    phone:String,
    ancoreTag:String,
    storeEmail:String,
    deviceID:String,
    info:String,
    hours:String,
    description:String,
    lat:String,
    long:String,
    identifier:String
});
var store=mongoose.model('store',StoreSchema);

exports.addStore=function(storeReq,loggedUser){
    var newStore=new store();
    newStore.set('addedBy',loggedUser);
    newStore.set('name',storeReq.name);
    newStore.set('storeNumber',storeReq.storeNumber);
    newStore.set('storeId',storeReq.storeId);
    newStore.set('_group',storeReq._group);
    newStore.set('_retailer',storeReq._retailer);
    newStore.set('address1',storeReq.address1);
    newStore.set('address2',storeReq.address2);
    newStore.set('city',storeReq.city);
    newStore.set('state',storeReq.state);
    newStore.set('zip',storeReq.zip);
    newStore.set('phone',storeReq.phone);
    newStore.set('ancoreTag',storeReq.ancoreTag);
    newStore.set('storeEmail',storeReq.storeEmail);
    newStore.set('deviceID',storeReq.deviceID);
    newStore.set('info',storeReq.info);
    newStore.set('hours',storeReq.hours);
    newStore.set('description',storeReq.description);
    newStore.set('lat',storeReq.lat);
    newStore.set('long',storeReq.long);
    newStore.set('identifier',storeReq.identifier);


    return new Promise((resolve,reject)=>{
        newStore.save(function(err){
           if(err){
               reject({err});
           }
           else{
               resolve({success:'Store Inserted Successfuly!'});
           }
       });
     })
}


exports.getAllStores=function(){
    return new Promise((resolve,reject)=>{
        store.find()
        .populate('addedBy')
        .populate('_group')
        .populate('_retailer')
        .exec(function(err,stores){
             if(err){
                reject({err})
             }else{
                resolve(stores);
             }
          });
     })
}

exports.getAllStoresByRetailer=function(retailers){
   return new Promise((resolve,reject)=>{
      store.find({_retailer:{$in:retailers}})
      .populate('addedBy')
        .populate('_group')
        .populate('_retailer')
        .exec(function(err,stores){
             if(err){
                reject({err})
             }else{
                resolve(stores);
             }
          });
   })
}

exports.getStoreById=function(id){
    return new Promise((resolve,reject)=>{
       store.findOne({_id:id})
       .populate('addedBy')
       .exec(function(err,store){
            if(err){
               reject({err})
            }else{
               resolve(store);
            }
         });
    })
 }


 exports.updateStore=function(storeReq){
    return new Promise((resolve,reject)=>{
       store.findOneAndUpdate(
          {_id:storeReq._id},
          storeReq,
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
 
 
 exports.removeStore=function(id){
    return new Promise((resolve,reject)=>{
       store.deleteOne({_id:id})
       .exec(function(err){
            if(err){
               reject({err})
            }else{
               resolve({msg:"deleted successfully"});
            }
         });
    })
 }


 exports.getStoresByRetailer=function(retailerId){
   return new Promise((resolve,reject)=>{
      store.find({_retailer:retailerId})
         .exec(function(err,doc){
            if(err){
               reject({err})
            }else{
               resolve(doc);
            }
         })
   }) 
 }

