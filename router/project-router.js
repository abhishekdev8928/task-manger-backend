const express = require("express");
const router = express.Router();
const Project = require("../controllers/project-controller");
const {blogSchema } = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bodyparser = require("body-parser");

router.use(bodyparser.urlencoded({extended:true}));
router.use(express.static(path.resolve(__dirname,'public')))
//project feature
router.route("/addproject").post(Project.addproject);
router.route("/getdataproject").get(Project.getdata);
router.route("/getprojectByid/:id").get(Project.getprojectByid);
router.route("/updateproject/:id").patch(Project.updateproject);

router.route("/deleteproject/:id").delete(Project.deleteproject);
router.route("/update-statusproject").patch(Project.updateStatus);
router.route("/getClientOptionsTable").get(Project.getClientOptionsTable);
router.route("/categoryOptions").get(Project.categoryOptions);
router.use(bodyparser.urlencoded({extended:true}));
router.use(express.static(path.resolve(__dirname,'public')))

    const storage = multer.diskStorage({
        destination: function(req,file, cb){
        if(!fs.existsSync("public")){
            fs.mkdirSync("public");
        }
        if(!fs.existsSync("public/allimages")){
            fs.mkdirSync("public/allimages");
        }
    
        cb(null, "public/allimages");
        },
        filename: function(req,file,cb){
        cb(null, Date.now() + file.originalname);
        },
    });
  
    const upload = multer({
        storage:storage,
    })

module.exports = router;