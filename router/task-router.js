const express = require("express");
const router = express.Router();
const Task = require("../controllers/task-controller");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bodyparser = require("body-parser");

router.use(bodyparser.urlencoded({ extended: true }));
router.use(express.static(path.resolve(__dirname, 'public')));

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "public/attchment";
    if (!fs.existsSync("public")) fs.mkdirSync("public");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.get("/categoryOptions", Task.categoryOptions);
router.post("/addtask", upload.single("file"), Task.addtask);
router.get("/projectOptions", Task.projectOptions);
router.get("/employeeOptions", Task.employeeOptions);
router.get("/getdatatask", Task.getdata);
router.patch("/update-statustask", Task.updateStatus);
router.delete("/deletetask/:id", Task.deletetask);
router.get("/gettaskByid/:id", Task.gettaskByid);
router.post("/updatetask/:id", upload.single("file"), Task.updatetask);
router.get("/todayTask", Task.todayTask);
router.get("/assigntoOptions", Task.assigntoOptions);
router.get("/overdueTask", Task.overdueTask);
router.get("/upcomingTasks", Task.upcomingTasks);

module.exports = router;
