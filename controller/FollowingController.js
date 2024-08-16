const userModel = require("../model/usermodel")


const addFollower = async (req,res)=>{

    const userId = req.body
    
    // If user is giving request to  own accont
    if(req.currentUser._id.toString() === userId.userId){
        return res.status(400).json({
            status:false,
            message:"You cannot follow yourself"
        })
    }

    try{
        console.log("B");

        const response = await userModel.findById(userId.userId)

        if(!response){
            return res.status(404).json({
                status:false,
                message:`user doesn't exist anymore`
            })
        }



        const addFollowingInCurrentUser = await userModel.findByIdAndUpdate(req.currentUser._id,{
            $addToSet:{
                following:userId.userId
            }
        },{ new: true }  // This option makes sure the updated document is returned
        )

        const addFollowerInAnotherUser = await userModel.findByIdAndUpdate(userId.userId,{
            $push:{
                followers:req.currentUser._id
            }
        },{ new: true }  // This option makes sure the updated document is returned
    )    

        console.log(addFollowingInCurrentUser);
        

        return res.status(200).json({
            status:true,
            message:"Add follower request",
            user:addFollowingInCurrentUser
        })

    }catch(e){

        return res.status(400).json({
            status:false,
            message:"Something went wrong"
        })
    }
}



const followingController = {
    addFollower,
}


module.exports = followingController
