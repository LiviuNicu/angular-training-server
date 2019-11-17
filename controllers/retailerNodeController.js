var retailerModel=require('./../models/retailerModel');



exports.addRetailer=(req,res)=>{
    retailerModel.addRetailer(req.body,req.userData)
    .then((response)=>{
        res.status(200).json(response)
    })
    .catch((error)=>{
        res.status(500).json(error);
    })
} 


exports.getAllRetailers=(req,res)=>{
   
    if(req.userData.admin){
        retailerModel.getAllRetailers()
        .then((response)=>{
            res.status(200).json(response)
        })
        .catch((error)=>{
            res.status(500).json(error);
        })
    }else{
        retailerModel.getAllRetailersByRetailers(req.userData._retailers)
        .then((response)=>{
            res.status(200).json(response)
        })
        .catch((error)=>{
            res.status(500).json(error);
        })
    }
}

exports.getRetailerById=(req,res)=>{
    retailerModel.getRetailerById(req.body._id)
    .then((response)=>{
        res.status(200).json(response)
    })
    .catch((error)=>{
        res.status(500).json(error);
    })
}

exports.updateRetailer=(req,res)=>{
    retailerModel.updateRetailer(req.body)
    .then((response)=>{
        res.status(200).json(response)
    })
    .catch((error)=>{
        res.status(500).json(error);
    })
}

exports.removeRetailer=(req,res)=>{
    retailerModel.removeRetailer(req.body._id)
    .then((response)=>{
        res.status(200).json(response)
    })
    .catch((error)=>{
        res.status(500).json(error);
    })
}

