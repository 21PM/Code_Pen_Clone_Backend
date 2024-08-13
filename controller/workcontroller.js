const workModel = require('../model/workmodel')
const userModel = require('../model/usermodel')
const myWork = async(req,res)=>{

    const userid = req.currentUser._id

    try{

        const isValidUser = await userModel.findById(userid).select("yourWork").populate("yourWork")
        if(!isValidUser){
            return res.json({
                status:false,
                message:"Invalid User"
            })
        }

        return res.json({
            status:true,
            message:"Success",
            data:isValidUser.yourWork
        })

    }catch(e){
        console.log(e);
        
        return res.status(500).json({
            status:false,
            message:"Something went wrong while getting your Work"
        })
    }
        
}

const addWork = async (req,res)=>{

    const {html,css,javascript,output,title} = req.body;

    const userId = req.currentUser._id       

    const CompleteWorkData = {
        html:html,
        css:css,
        javascript:javascript,
        output:output,
        title:title,
        postedByUser:userId
    }
    try{
        const SaveWork = await workModel.create(CompleteWorkData)

        if(!SaveWork){
            return res.json({
                status:false,
                message:'Unable to save the work someting went wrong'
            })
        }
        
        const updateWorkIdInUserAccount = await userModel.findByIdAndUpdate(userId,{
            $push:{
                yourWork:SaveWork._id,
            }
        },
        {new:true})

        return res.status(200).json({
            status:true,
            message:`Your work has been saved`,  
        })

    }catch(e){
        console.log(e);
        return res.status(500).json({
            status:false,
            message:`Unable to add work somethinh went wrong`,
            error:"e"
        })
    }
}

const deleteWorK = async (req,res)=>{

    const workId = req.params.workId
    const user = req.currentUser

    try{

        const isValidWorkId = await workModel.findById(workId)


        if(user._id.toString() !== isValidWorkId.postedByUser._id.toString()){
                return res.status(500).json({
                    status:false,
                    message:"You are not authorized to delete the post, Only account holder himself can delete the post"
                })
                
        }
        
        const DeleteWork = await workModel.findByIdAndDelete(workId)

        const deleteWorkIdFromUser = await userModel.findByIdAndUpdate(user._id,{
            $pull:{
                yourWork:workId
            }
        })

        if(!DeleteWork){
            return res.json({
                status:false,
                message:"Unable to delete work Id from user's account"
            })
        }

        console.log(DeleteWork);
        

        return res.json({
            status:true,
            message:"Your Work has been deleted",
            id:workId
        })
    }catch(e){
        return res.status(500).json({
            status:false,
            message:"error"
        })
    }
}

const editWork = async (req,res)=>{

    const workId = req.params.workId
    const {title,html,css,js,output} = req.body;


    try{
        
        const isWorkAvailable = await workModel.findById(workId)
        if(!isWorkAvailable){
            return res.status(404).json({
                status:false,
                message:"Invalid Work Id"
            })
        }
        // console.log(isWorkAvailable.postedByUser);
        if(isWorkAvailable.postedByUser.toString() !== req.currentUser._id.toString()){
            return res.status(401).json({
                status:false,
                message:"You are not authorised to edit the work"
            })
        }
        const updatedEditedWork = await workModel.findByIdAndUpdate(workId,{
            $set:req.body
        })
        

        return res.status(200).json({
            status:true,
            message:"Your Work has been updated",
            id:workId
        })

    }catch(e){
        return res.status(500).json({
            status:true,
            message:"Error Something went wrong",
            error:e
        })
    }


}

const searchWork = async (req,res)=>{

    const queries = req.query.title

    try{

        const searchedData = await userModel.findById(req.currentUser._id).select("yourWork").populate(
            {
            path:"yourWork",
            match:{title: new RegExp(queries,'i')}
            }
        )   
        return res.status(200).json({
            status:true,
            message:`Search API ${queries}`,
            searchedData:searchedData
        })
        
    }catch(e){
        return res.status(500).json({
            status:false,
            message:`Search API ${query}`
        })
    }


}


const TrendingWork = async (req,res)=>{

    const skipCount  = req.query.skipCount
        console.log(skipCount);
        

    try{
        console.log("paras");
        
        const getTrendingworks = await workModel.find({}).limit(6).skip(6* Number(`${skipCount}`))
        return res.status(200).json({
            status:true,
            message:"Trending work api",
            TrendingWork:getTrendingworks
        })

    }catch(e){
        return res.status(500).json({
            status:true,
            message:"Error Something went wrong",
            error:e
        })

    }

 
}

const workController = {
    myWork,
    addWork,
    deleteWorK,
    editWork,
    searchWork,
    TrendingWork
}


module.exports = workController;