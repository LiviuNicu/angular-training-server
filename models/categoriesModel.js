var mongoose = require('mongoose'), Schema = mongoose.Schema;

var CategoriesSchema = new Schema({
    name: { type: String, required: true },
    dateAdded: { type:Date, default: Date.now },
    addedBy: { type: Schema.Types.ObjectId, ref: 'user' },
});
var category=mongoose.model('category',CategoriesSchema);

exports.addCategory = function (obj, loggedUserId) {
    var newCategory = new category();
    newCategory.set('name',obj.name);
    newCategory.set('addedBy',loggedUserId);

    return new Promise((resolve,reject)=>{
        newCategory.save(function(err){
           if(err){
               reject({err});
           }
           else{
               resolve({success:'Circular Group Inserted Successfuly!'});
           }
       });
     })
}

exports.getAllCategories = function () {
    return new Promise((resolve,reject) => {
        category.find()
        .exec(function(err,categories){
            if(err){
               reject({err})
            }else{
               resolve(categories);
            }
         });
    })
}

exports.updateCategory=function(categoryReq){
    return new Promise((resolve,reject)=>{
       category.findOneAndUpdate(
          {_id:categoryReq._id},
          categoryReq,
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

 exports.removeCategory=function(id){
    return new Promise((resolve,reject)=>{
       category.deleteOne({_id:id})
       .exec(function(err){
            if(err){
               reject({err})
            }else{
               resolve({msg:"deleted successfully"});
            }
         });
    })
 }