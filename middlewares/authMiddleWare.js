const jwt = require("jsonwebtoken")
const userModel = require("../model/usermodel")

const authMiddleWare = async (req,res,next)=>{


    const BearerToken = req.headers.authorization
    if(!BearerToken){
        return res.json({
            status:false,
            message:"Invalid token please login again"
        })
    }

    const token  = BearerToken.split(" ")[1];
    
    try{
        const decoded = jwt.verify(token,process.env.JWTSECRETKEY)

        const currentUser = await userModel.findById(decoded.userId)
        if(!currentUser){
            return res.json({
                status:false,
                message:'User do not exist' 
            })
        }   
            req.currentUser = currentUser
            
        next()

    }catch(e){
        return res.json({
            status:true,
            message:"Invaid Token"
        })
    }
    



}


module.exports = authMiddleWare;