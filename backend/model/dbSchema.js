const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    
    username: {
        type: String
    },
    password: {
        type: String
    }
})

const RoomsSchema = new mongoose.Schema({
    
    id:{type:String},
    receiverHasRead:{ 
                    
                    type: Boolean,
    			    default:false	
    			
    			 },
    users:[],
    messages: [
            {
                sender: {
                    type: String,
                    //required: true
                },
                message: {
                    type: String,
                    //required: true
                },
                date: {
                    type: Date,
                    default: Date.now
                }
        }
    ]
})


var Users = mongoose.model("Users" , UserSchema);
var Rooms = mongoose.model("Rooms" , RoomsSchema);


module.exports = {
    Rooms: Rooms,
    Users: Users
}

