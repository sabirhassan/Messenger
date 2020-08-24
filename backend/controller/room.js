const {Rooms} = require("../model/dbSchema")



module.exports.GetChat = function (req, res) {

    console.log(123,"get chat")
    console.log(req.body)

    Rooms.find({users:req.body.username})
    .then((chats)=>{
        res.send(chats)
    })
  
};

module.exports.ReadMessage = function (req, res) {

    console.log(123,"read me")
    console.log(req.body)
    Rooms.updateOne(
        {"id":req.body.id},
        {
            $set:{"receiverHasRead":true}
        }
        ).then((chat)=>{
            res.send(chat)

        })

  
};

module.exports.SendMessage = function (req, res) {

    console.log(123,"send message")
    console.log(req.body)
    Rooms.updateOne(
        {"id":req.body.id},
        {
            $push:{messages:req.body.message},
            $set:{"receiverHasRead":false}

        }
        ).then((chat)=>{
            res.send(chat)

        })
  
};

module.exports.CheckChat = function (req, res) {

    console.log(123,"check chat")
    console.log(req.body)

    Rooms.findOne({id:req.body.id})
    .then((chats)=>{
        res.send(chats)
    })
  
};

module.exports.CreateRoom = function (req, res) {

    console.log(123,"create room")
    const newVal = Rooms({id:req.body.id,users:[req.body.user,req.body.friend],messages:[req.body.message]})
    newVal.save()
    .then((chat)=>{
        res.send(chat)
    })

  
};
