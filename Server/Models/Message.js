const mongoose= require('mongoose')

const schema= mongoose.Schema({
    text:String,
    imageUrl:String,
    videoUrl:String,
    seen:{
        type:Boolean,
        default:false
    },
    yhaTak:{
        type:Boolean,
        default:false,
    },
    sendBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }
},{
    timestamps:true
})

module.exports= mongoose.model('Message',schema)