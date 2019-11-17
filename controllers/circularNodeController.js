var circularModel = require("./../models/circularModel");
var pdfModel = require("./../models/pdfModel");

exports.addCircularGroup = (req, res) => {
  circularModel
    .addCircularGroup(req.body, req.userData._id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.getCircularGroups = (req, res) => {
  if (req.userData.admin) {
    circularModel
      .getAllCircularGroups()
      .then(response => {
        res.status(200).json(response);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    circularModel
      .getAllCIrcularGroupsByRetailer(req.userData._retailers)
      .then(response => {
        res.status(200).json(response);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  }
};

exports.getCircularGroupById = (req, res) => {
  circularModel
    .getCircularGroupById(req.body)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.updateCircularGroup = (req, res) => {
  circularModel
    .updateCircularGroup(req.body)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.deleteCircularGroup = (req, res) => {
  circularModel
    .removeCircularGroup(req.body._id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.addCircular = (req, res) => {
  circularModel
    .addCircular(req.body, req.userData)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.getCirculars = (req, res) => {
  if (req.userData.admin) {
    circularModel
      .getAllCirculars()
      .then(response => {
        res.status(200).json(response);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  } else {
    circularModel
      .getAllCircularByRetailer(req.userData._retailers)
      .then(response => {
        res.status(200).json(response);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  }
};

exports.getCircularById = (req, res) => {
  circularModel
    .getCircularById(req.body._id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.updateCircular = (req, res) => {
  circularModel
    .updateCircular(req.body)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.deleteCircular = (req, res) => {
  circularModel
    .removeCircular(req.body._id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.getPageById = (req, res) => {
  pdfModel
    .getPageById(req.body._id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.addProductToPage = (req, res) => {
  pdfModel
    .addProduct(req.body, req.userData)
    .then(response => {
      if (response._id) {
        pdfModel
          .addProductToPage(req.body.page, response._id)
          .then(response => {
            res.status(200).json({ msg: "success" });
          });
      } else {
        req.status(500).json({ error: "product not added" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.cloneProducts = (req, res) => {
  let arr = [];
  let products = req.body.products.map(item => {
    delete item._id;
    item.page = req.body.page;
    arr.push(pdfModel.addProduct(item, req.userData));
    return item;
  });

  Promise.all(arr)
    .then(response => {
      pdfModel
        .cloneProductsToPage(
          req.body.page,
          response.map(item => {
            return item._id;
          })
        )
        .then(response => {
          res.status(200).json({ msg: "success" });
        })
        .catch(error => {
          res.status(500).json(error);
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.editProduct = (req, res) => {
  pdfModel
    .editProduct(req.body)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.addOrUpdatePagesFromCirculars = (req, res) => {
  circularModel
    .addOrUpdatePagesFromCirculars(
      req.body.circular,
      req.body.group,
      req.body.pages
    )
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.getAssignedPages = (req, res) => {
  circularModel
    .getAssignedPages(req.body.circular)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.removeProduct = (req, res) => {
  pdfModel
    .deleteProductFromPage(req.body.pageId, req.body.settingId)
    .then(response => {
      pdfModel
        .deleteProduct(req.body.settingId)
        .then(response => {
          res.status(200).json(response);
        })
        .catch(error => {
          res.status(500).json(error);
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.removePage = (req, res) => {
  pdfModel.getPageById(req.body.pageId).then(response => {
    let selectedPage = response;

    let promise = Promise.resolve();
    promise
      .then(() => {
        return circularModel.deletePageFromCircular(
          req.body.circularId,
          selectedPage._id
        );
      })
      .then(() => {
        return pdfModel.deleteProductFromPage(selectedPage._products);
      })
      .then(() => {
        return pdfModel.deleteAllAssetsFromPage(selectedPage._assets);
      })
      .then(() => {
        return circularModel.deleteAllAssignedByPage(req.body.pageId);
      })
      .then(() => {
        return pdfModel.deletePage(selectedPage._id);
      })
      .then(response => res.status(200).json(response))
      .catch(error => {
        console.log(error);
        res.status(500).json(error);
      });

    return promise;
  });
};

exports.getCurrentPagesForGroup = (req, res) => {
  circularModel
    .getCurrentPagesForGroup(req.body.groupId)
    .then(response => {
      let mainRes = response;
      console.log("getCurrentPagesForGroup", response);
      circularModel
        .getCurrentPageNumbersForGroup(req.body.groupId)
        .then(response => {
          let pageOrder = response;
          let pagesToBeAdded = [];
          if (pageOrder.pages.length) {
            pageOrder.pages = pageOrder.pages
              .filter(item => {
                return item.order != undefined;
              })
              .map(item => {
                pagesToBeAdded.push(item.id);
                return item;
              });
            console.log("pagesToBeAdded", pagesToBeAdded);
            mainRes.pages = mainRes.pages.filter(item => {
              return pagesToBeAdded.indexOf(item.id) != -1;
            });
            // mainRes._circular._pages = mainRes._circular._pages.filter(item => {
            //   return pagesToBeAdded.indexOf(item) != -1;
            // });
            console.log("mainRes", mainRes);

            res.status(200).json(mainRes);
          }
        });
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

exports.rename = (req, res) => {
  pdfModel
    .renameSettingsToProducts()
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};
