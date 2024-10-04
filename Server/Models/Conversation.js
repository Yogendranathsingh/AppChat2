const mongoose= require('mongoose')

const schema= mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    messages:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Message'
        }],
        required:true
    }
},{
    timestamps:true
})

module.exports= mongoose.model('Conversation',schema)