const mongoose = require('mongoose')



const connectDB = async ()=>{
  try {
      mongoose.Promise = global.Promise;
      await mongoose.connect('mongodb://localhost/imroz2', 
      {
        useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
      })
      const db = mongoose.connection;
      db.on("error", error => 
        console.log(error)
      )
      db.once("open", () => 
        console.log("connected to db")
      )
  } catch (err) {
      console.log(err)
      //process.exit(1)        
  }
}

module.exports = connectDB
