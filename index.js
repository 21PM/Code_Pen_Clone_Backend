const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const useRoutes = require("./routes/useroutes")


dotenv.config()
const app = express();

mongoose.connect("mongodb://localhost:27017/CodePen")
.then(()=>{
    console.log("DB has been connected");
}).catch((e)=>{
    console.log(`error while connecting to DB ${e}`);
})
app.use(express.json())


app.use(useRoutes)



app.listen(10000,()=>{
    console.log(`Server is up at port ${process.env.PORT}`);
    
})