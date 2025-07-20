const express=require('express');
const wrapAsync = require('../utils/wrapAsync');
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controller/users.js");

//to render signup form and perform signup operation
router.route("/signup")
.get((userController.RenderSignupform))
.post(wrapAsync(userController.SignupProcess));

//to render login form and perform login operation
router.route("/login")
.get((userController.RenderLoginform))
.post(saveRedirectUrl,
passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),
userController.LoginProcess
);


//to perform logout process
router.get("/logout",(userController.LogoutProcess));

module.exports=router;