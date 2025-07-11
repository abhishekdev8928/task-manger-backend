const express = require("express");
const router = express.Router();
const authcontrollers = require("../controllers/auth-controller");
const {signupSchema , loginSchema } =require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");
const  authMiddleware = require("../middlewares/auth-middleware");


router.route("/").get(authcontrollers.home);

router
    .route("/register")
    .post(validate(signupSchema),authcontrollers.register);

router.route("/login").post(validate(loginSchema), authcontrollers.login);
router.route("/authverify").post(authcontrollers.authverify);
router.route("/resendverify").post(authcontrollers.resendverify);
router.route("/forgot").post(authcontrollers.forgot);
router.route("/verify-reset-token").post(authcontrollers.verifyResetToken);
router.route("/resetpassword").post(authcontrollers.resetpassword);
router.route("/logout").post(authcontrollers.logout);

router.route("/user").get(authMiddleware, authcontrollers.user);
module.exports = router;