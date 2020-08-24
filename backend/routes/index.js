const express = require('express');
const ctrl_room = require("../controller/room")
const ctrl_user = require("../controller/user")

const router = express.Router();

router
    .route("/login")
    .post(ctrl_user.Login);


router
    .route("/signup")
    .post(ctrl_user.Signup);

router
    .route("/getchat")
    .post(ctrl_room.GetChat);


router
    .route("/readmessage")
    .post(ctrl_room.ReadMessage);

router
    .route("/sendmessage")
    .post(ctrl_room.SendMessage);

router
    .route("/checkuser")
    .post(ctrl_user.CheckUser);
    
router
    .route("/checkchat")
    .post(ctrl_room.CheckChat);
    
router
    .route("/createroom")
    .post(ctrl_room.CreateRoom);

module.exports = router;
