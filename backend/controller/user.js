const {Users, Rooms} = require("../model/dbSchema")



module.exports.Login = function (req, res) {

    console.log(123,"login")
    console.log(req.body);
    Users.findOne({"username":req.body.username,"password":req.body.password})
        .then((user)=>{
            res.send(user)

        })

  
};

module.exports.Signup = function (req, res) {

    console.log(123,"signup")
    console.log(req.body);
    if(!(isUserAlreadyExists(req,res))){
        const newVal = Users({username:req.body.username,password:req.body.password})
        newVal.save()
        .then((user)=>{
            res.send(user)
        })
    }
 
};

module.exports.CheckUser = async function (req, res) {

    console.log(123,"check user")
    console.log(req.body)
    Users.findOne({"username":req.body.username})
    .then((user)=>{
        
        res.send(user)
        
    })
  
};


function isUserAlreadyExists(req,res){
    Users.findOne({"username":req.body.username})
    .then((user)=>{
        if(user){
            return true
        }
        else{
            return false
        }
    })
}