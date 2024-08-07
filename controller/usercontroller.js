const userModel = require("../model/usermodel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const SignUp = async(req,res)=>{

    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.json({
            status:false,
            message:"Please Provide all details for registration"
        })
    }

    try{

        const isAlreadyRegistered = await userModel.findOne({email:email})        
        if(isAlreadyRegistered){
            return res.status(400).json({
                status:false,
                message:'Your Email Id is already registered'
            })
        }

        const addNewUser = await userModel.create(req.body)
        console.log(addNewUser);
        
        return res.json({
            message:"Your account has been created"
        })

    }catch(e){
        if (e.name === 'ValidationError') {
            return res.status(400).json({
                status:false,
                error: e.message
             });
        }
        console.log(e);
        
        return res.status(500).json({
            status:false,
            message:`Server error, please try again later`,
            error:e
        })
    }
    
}

const Login = async (req,res)=>{

    const{email,password} = req.body;

    if(!email || !password){
        return res.status(404).json({
            status:false,
            message:"Please provide email id and password"
        })
    }
    try{
        const isOurUser = await userModel.findOne({email})
        if(!isOurUser){
            return res.status(404).json({
                status:false,
                message:"Invalid Email id or Password"
            })
        }
        const isValidPassword = bcrypt.compareSync(password,isOurUser.password)
        if(!isValidPassword){
            return res.status(404).json({
                status:false,
                message:"Invalid Email id or Password"
            })
        }

        const tokenPayload = {
            userId:isOurUser._id,
        }

        const token = jwt.sign(tokenPayload,process.env.JWTSECRETKEY)
        res.cookie('CPToken', token, { httpOnly: true, secure: false, maxAge: 3600000 // Cookie expires in 1 hour
        });
        return res.json({
            message:"Login api"
        })

    }catch(e){
        console.log(e);
        return res.status(400).json({
            status:false,
            message:"Unable to Login",
            error:e
        })
    }
}


const userController = {
    SignUp,
    Login
}

module.exports = userController
