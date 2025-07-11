const express = require("express");
const router = express.Router();
const Privilegecontrollers = require("../controllers/privilege-controller");

router.route("/addrole").post(Privilegecontrollers.addrole);
router.route("/getrolebyid/:id").get(Privilegecontrollers.getrolebyid);
router.route("/editrole/:id").patch(Privilegecontrollers.editrole);
router.route("/deleterole/:id").delete(Privilegecontrollers.deleterole);
router.route("/getroles/:id").get(Privilegecontrollers.getroles);

//users 
router.route("/adduser").post(Privilegecontrollers.adduser);
router.route("/getuserbyid/:id").get(Privilegecontrollers.getuserbyid);
router.route("/updateuser/:id").patch(Privilegecontrollers.updateuser);
router.route("/statususer/:id").patch(Privilegecontrollers.statususer);
router.route("/deleteuser/:id").delete(Privilegecontrollers.deleteuser);
router.route("/getuser").get(Privilegecontrollers.getuser);
router.route("/setprivileges/:id").patch(Privilegecontrollers.setprivileges);

module.exports = router;