const userModel = require("../model/usermodel")
const workModel = require("../model/workmodel")

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
            $addToSet:{
                followers:req.currentUser._id
            }
        },{ new: true }  // This option makes sure the updated document is returned
    )    

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

const getFollowingWork = async (req,res)=>{

    const UserId = req.currentUser._id;
    const skipCount = parseInt(req.query.skipCount)
    
        try{

            const followingData = await userModel.findById(UserId).select("following -_id")
            if(!followingData){
                return res.status(400).json({   
                    status:false,
                    message:"Error no following data for give user Id"
                })
            }

            const followingIdArray = followingData.following

                const updatedData = await workModel.find({postedByUser:{
                    $in:followingIdArray
                }}).limit(6).skip(6 * skipCount)
                

            
            return res.status(200).json({
                status:true,
                message:'get following work APi',
                FollowingData:updatedData
            })

        }catch(e){
            return res.status(400).json({
                status:false,
                message:'Error while getting data from following work'
            })
        }
}


const getFollowingSearchWork = async (req,res)=>{

    const name = req.query.name
    console.log(name);
    
    try{
        const FollowingIdArray = await userModel.findById(req.currentUser._id).select("following -_id")

        const SearchedWorkData = await workModel.find({
            $and: [
              { postedByUser: { $in: FollowingIdArray.following } },
              { postedByUserName: new RegExp(name, 'i') }
            ]
          })

          


        return res.status(200).json({
            status:true,
            SearchedData:SearchedWorkData
        })
        
    }catch(e){
        return res.status(400).json({
            status:false,
            error:e
        })
        
    }

}


const removeFollowing = async (req,res)=>{
        
        const postedById = req.body;

        try{
            const removeFollowingId = await userModel.findByIdAndUpdate(req.currentUser._id,{
                $pull:{
                    following:postedById.postedById
                }
            },  
            { new: true }
        )

            if(!removeFollowingId){
                return res.status(401).json({
                    status:false,
                    message:"Unable to remove id from my account"
                })
            }

            const removeFollowerId = await userModel.findByIdAndUpdate(postedById.postedById,{
                $pull:{
                    followers:req.currentUser._id
                }
            })
            
            
            if(!removeFollowerId){
                return res.status(401).json({
                    status:false,
                    message:"Unable to remove id from another person account "
                })
            }


            return res.status(200).json({
                status:true,
                message:'You are sucessfully unfollowed',
                user:removeFollowingId

            })
        }catch(e){
            console.log(e);
            
            return res.status(400).json({
                status:false,
                message:'Error While requesting for unfollowing'
            })
        }
}


const showFollowings = async (req,res)=>{

    try{
        const showFollowingsdetails = await userModel.findById(req.currentUser._id).select("following -_id").populate("following", "name")

        if(!showFollowings){
            return res.status(400).json({
                status:false,
                message:"Unable to get following details or user not found "
            })
        }

        return res.status(200).json({
            status:true,
            message:"Show Following API",
            followingData:showFollowingsdetails.following
        })

    }catch(e){
        return res.status(400).json({
            status:false,
            message:"Error while show following details"
        })
    }

}

const showFollowers = async (req,res)=>{
        try{

            const showFollowesdetails = await userModel.findById(req.currentUser._id).select("followers -_id").populate("followers","name")

            if(!showFollowesdetails){
                return res.status(400).json({
                    status:false,
                    message:"Unable to get followers Details or User not found"
                })
            }

            return res.status(200).json({
                status:true,
                message:"show followers API",
                followersData:showFollowesdetails.followers
            })

        }catch(e){
            return res.status(400).json({
                status:false,
                message:"Error while show followers details"
            })
        }
}

const followingController = {
    addFollower,
    getFollowingWork,
    getFollowingSearchWork,
    removeFollowing,
    showFollowings,
    showFollowers
}


module.exports = followingController
