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
                message: e.message
             });
        }
        console.log(e);
        
        return res.status(500).json({
            status:false,
            message:`Server error, please try again later`,
            error:e.message
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

        const token = jwt.sign(tokenPayload,process.env.JWTSECRETKEY,{expiresIn:"1h"})
        res.cookie('CPToken', token, { httpOnly: false, secure: false,sameSite:'lax',
            expires: new Date(Date.now() + 1 * 60 * 60 * 1000) , 
            path: '/'
        });

        const addTokenInUser = await userModel.findOneAndUpdate({email},{
            $set:{
                token: token 
            }
        })

        return res.json({   
            status:true,
            message:"Your are sucessfully logged in",
            token:token,
            user:isOurUser
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

const Logout = async (req,res)=>{

    try{

        const removeTokenFromUser = await userModel.findByIdAndUpdate(req.currentUser._id,{
            $set:{
                token:""
            }
        })

        if(!removeTokenFromUser){
            return res.status(401).json({
                status:false,
                message:`Something went wrong please try again`
            })
        }

        return res.status(200).json({
            status:true,
            message:"You are sucessfully logged out"
        })

    }catch(e){

        return res.status(500).json({
            status:true,
            message:"Unable to logout something went wrong",
            error:e
        })
    }


}

const userController = {
    SignUp,
    Login,
    Logout
}

module.exports = userController
