const express = require("express");
const router = express.Router();

const ClientController = require("../controllers/client-controller"); // ✅ Proper naming
const { blogSchema } = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

// ✅ Middlewares
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static(path.resolve(__dirname, "../public"))); // corrected static path

// ✅ Client Routes
router.post("/addclient", ClientController.addclient);
router.get("/getdataclient", ClientController.getdata);
router.get("/getclientByid/:id", ClientController.getclientByid);
router.patch("/updateclient/:id", ClientController.updateclient);
router.delete("/deleteclient/:id", ClientController.deleteclient);
router.patch("/update-statusclient", ClientController.updateStatus);

// ✅ File upload handling (if needed later)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.resolve("public/allimages");

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

module.exports = router;
