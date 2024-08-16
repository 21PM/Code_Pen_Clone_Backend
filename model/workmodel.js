const mongoose = require("mongoose")

const workSchema = new mongoose.Schema({
    html:{
        type:String,
        required:true,
        default:""
    },
    css:{
        type:String,
        required:true,
        default:""
    },
    javascript:{
        type:String,
        required:true,
        default:""
    },
    output:{
        type:String,
        required:true,
        default:""
    },
    title:{
        type:String,
        required:true,
        default:""
    },
    postedByUser:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref: "users",
    },
    postedByUserName:{
        type:String,
        required:true,
        ref: "users",
    }
})

const workModel = mongoose.model("allworks",workSchema)

module.exports = workModel