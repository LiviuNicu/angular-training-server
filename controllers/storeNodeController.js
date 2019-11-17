var storeModel=require('./../models/storeModel');
var retailerModel=require('./../models/retailerModel');


exports.addStore=(req,res)=>{
    storeModel.addStore(req.body,req.userData)
    .then((response)=>{
        res.status(200).json(response)
    })
    .catch((error)=>{
        res.status(500).json(error);
    })
} 


exports.getAllStores=(req,res)=>{
    if(req.userData.admin){
        storeModel.getAllStores()
        .then((response)=>{
            res.status(200).json(response)
        })
        .catch((error)=>{
            res.status(500).json(error);
        })
    }else{
        storeModel.getAllStoresByRetailer(req.userData._retailers)
        .then((response)=>{
            res.status(200).json(response)
        })
        .catch((error)=>{
            res.status(500).json(error);
        })
    }
}

exports.getStoreById=(req,res)=>{
    storeModel.getStoreById(req.body._id)
    .then((response)=>{
        res.status(200).json(response)
    })
    .catch((error)=>{
        res.status(500).json(error);
    })
}

exports.updateStore=(req,res)=>{
    storeModel.updateStore(req.body)
    .then((response)=>{
        res.status(200).json(response)
    })
    .catch((error)=>{
        res.status(500).json(error);
    })
}

exports.removeStore=(req,res)=>{
    storeModel.removeStore(req.body._id)
    .then((response)=>{
        res.status(200).json(response)
    })
    .catch((error)=>{
        res.status(500).json(error);
    })
}

exports.getStoresByRetailer=(req,res)=>{
retailerModel.getRetailerBySlug(req.body.slug)
    .then((response)=>{
        storeModel.getStoresByRetailer(response._id)
        .then((response)=>{
            res.status(200).json(response)
        })
        .catch((error)=>{
            res.status(500).json(error);
        })
    }).catch((error)=>{
        res.status(500).json(error);
    })
   
}