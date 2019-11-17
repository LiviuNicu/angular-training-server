var categoriesModel=require('./../models/categoriesModel');

exports.addCategory = (req,res) =>{
    categoriesModel.addCategory(req.body,req.userData._id)
    .then((response)=>{
        res.status(200).json(response)
    })
    .catch((error)=>{
        res.status(500).json(error);
    })
}

exports.updateCategory = (req,res) => {
    categoriesModel.updateCategory(req.body)
    .then((response) => {
        res.status(200).json(response);
    })
    .catch((error)=>{
        res.status(500).json(error);
    })
}

exports.getAllCategories = (req,res) => {
    categoriesModel.getAllCategories()
    .then((response) => {
        res.status(200).json(response);
    })
    .catch((error)=>{
        res.status(500).json(error);
    })
}

exports.deleteCategory = (req,res) => {
    categoriesModel.removeCategory(req.body._id)
    .then((response) => {
        res.status(200).json(response);
    })
    .catch((error)=>{
        res.status(500).json(error);
    })
}