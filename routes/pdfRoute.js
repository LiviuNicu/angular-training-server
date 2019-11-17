const express = require('express');
const router = express.Router();
const JWT=require('../middleware/jwt');
var pdfModel=require('./../models/pdfModel');
var circularModel=require('./../models/circularModel');
const https = require('https');
const http = require('http');
router.post('/upload', JWT.checkToken, function(req, res) {
    let circularId=req.query.circular;
    console.log(req); // the uploaded file object

    if (Object.keys(req.files).length == 0) {
        return res.status(400).send('No files were uploaded.');
    }
    
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    let filesArr=[];
    //console.log(req.files);
    if(sampleFile.length){
        sampleFile.map((item)=>{
            filesArr.push(pdfModel.addToHistory(item.name.replace('.pdf',''),req.userData._id,item))
        })
    }else{
        filesArr.push(pdfModel.addToHistory(sampleFile.name.replace('.pdf',''),req.userData._id,sampleFile))
    }
    Promise.all(filesArr)
    .then((response)=>{
        res.status(200).json(response.map(item=>item.doc));
        response.map((resp)=>{
            let url='./uploads/circulars/'+'circular_'+circularId+'_'+resp.doc._id+'.pdf';
            resp.file.mv(url, (err) => {
                if (err)
                    res.status(500).send(err);
            });
        });
       
    }).catch(err=>{
        res.status(500).json({err})
    })
  });


  router.post('/addPage', JWT.checkToken, function(req, res) {
    let body=req.body;
    let lastPromise=Promise.resolve();
    lastPromise.then(()=>{return pdfModel.addPageToCircular(body.circular,{pageNr:body.pageNr,url:body.page},body.pdf)})
        .then((response)=>{return circularModel.addPageToCircular(body.circular,response._id)})
        .then((response)=>{res.status(200).json({msg:'success'})})
        .catch(err=>{res.status(500).json({err})})
    return lastPromise;
  });


/* extract images from pdf */
router.post('/extract',JWT.checkToken,function(event, context, callback) {
    let requestBody = event.body;

    require('../helpers/domstubs.js').setStubs(global);
   
    const pdfjsLib = require('pdfjs-dist');    
    let extractedImages = [];
   
    return http.get(requestBody.pdfUrl, (response) => {

        let data = [];

        response.on('data', (chunk) => {
            data.push(chunk);
        });

        response.on('end', () => {
           
            let rawImageFile = new Uint8Array(Buffer.concat(data));

            function processImage() {
                let reqArrPages=[];
              
                let lastPromise=Promise.resolve();
                lastPromise.then(()=>circularModel.getCircularById(requestBody.circularId))
                           .then((response)=>{return addAssets(response._pages)})
                           .then(sendResponse.bind(null,requestBody.circularId))
                           .catch(err=>{console.log(err)})

                function addPages(pages){
                    if(pages.length){
                        pages.map((item)=>{
                            reqArrPages.push(pdfModel.addPageToCircular(requestBody.circularId,item))
                        })
    
                        if(reqArrPages.length){
                            return Promise.all(reqArrPages)
                        }
                    }
                }

                function addPagesToCircular(pages){
                    if(pages.length){
                        return circularModel.addPagesToCircular(requestBody.circularId,pages)
                    }
                }

                function addAssets(pages){
                    let req=[];
                    pages.map((item)=>{
                        if(extractedImages.length){
                            let reqArrAssets=[];
                          
                            let assetsByPage=extractedImages.filter((asset)=>{return asset.pageNr==item.pageNr})
                            assetsByPage.map((filteredAsset)=>{
                                reqArrAssets.push(pdfModel.addAssetToPage(item._id,filteredAsset))
                            })
                            Promise.all(reqArrAssets).then((response)=>{
                                req.push(pdfModel.addAssetsToPage(item._id,response))        
                            }).catch(err=>{reject({err});})
                        }
                    })
                   return Promise.all(req)
                }
                return lastPromise;
            }

         

            let loadingTask = pdfjsLib.getDocument({
                data: rawImageFile,
                nativeImageDecoderSupport: pdfjsLib.NativeImageDecoding.DISPLAY,
            });


            loadingTask.promise.then(function (doc) {
                let numPages = doc.numPages;
                console.log('# Document Loaded');
                console.log(`Number of Pages:  ${numPages}`);

                let lastPromise = Promise.resolve();
              
                
                let loadPage = function (pageNum) {
                    return doc.getPage(pageNum).then(page => {
                        console.log(`# Page ${pageNum}`);
                        return page.getOperatorList().then(opList => {
                            let svgGfx = new pdfjsLib.SVGGraphics(page.commonObjs, page.objs);
                            svgGfx.embedFonts = true;
                            for (let i = 0; i < opList.fnArray.length; i++) {
                                if (opList.fnArray[i] === pdfjsLib.OPS.paintJpegXObject) {
                                    let imageInfo = page.objs.get(opList.argsArray[i][0]);
                                    extractedImages.push({pageNr:pageNum,url:imageInfo._src.split('data:image/jpeg;base64,')[1]});
                                }
                            }
                           
                        });
                    });
                };

                for (let i = 1; i <= numPages; i++) {
                    lastPromise = lastPromise.then(loadPage.bind(null, i));
                }
                return lastPromise;
            }).then(() => {
                    console.log('# End of Document')
                    return processImage();
                }
                , (err) =>{
                    
                    console.error(`Error: ${err}`)
                });

        });
    });

    function sendResponse(circularId) {
        console.log('4')
        circularModel.getCircularById(circularId)
        .then((response)=>{
            context.status(200).json(response)
        }).catch((error)=>{
            context.status(500).json({error})
        })
    }
});

module.exports = router;
