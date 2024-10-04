const mongoose= require('mongoose')

const schema= mongoose.Schema({
    name:{
        type:String,
        required:[true,'provide name']
    },
    email:{
        type:String,
        unique:true,
        required:[true,'provide email']
    },
    password:{
        type:String,
        required:[true,'provide password']
    },
    profilePic:{
        type:String,
    }
},{
    timestamps:true
})

module.exports= mongoose.model('User',schema)