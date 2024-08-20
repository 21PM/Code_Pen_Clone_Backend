const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const dotenv = require("dotenv")
dotenv.config()
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim: true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true
    },
    password:{
        type:String,
        required:true,
    }, 
    yourWork:{
        type:[mongoose.Types.ObjectId],
        ref:"allworks",
        default:[]
    },
    following:{
        type:[mongoose.Types.ObjectId],
        ref:"users",
        default:[]
    },
    followers:{
        type:[mongoose.Types.ObjectId],
        ref:"users",
        default:[]
    },
    token:{
        type:String,
        required:false,

    }
},
{
    timestamps:true
})

userSchema.pre("save",function(next){
        if(this.isModified("password")){
        const saltRoundes = Number(process.env.SALT)
          const hash = bcrypt.hashSync(this.password,saltRoundes);
          this.password = hash
        }
        next()
})


const userModel = mongoose.model("users",userSchema)

module.exports = userModel;