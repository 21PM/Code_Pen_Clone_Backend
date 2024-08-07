const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const useRoutes = require("./routes/useroutes")
const cookieParser = require("cookie-parser")

dotenv.config()
const app = express();

mongoose.connect(process.env.MongoURL)
.then(()=>{
    console.log("DB has been connected");
}).catch((e)=>{
    console.log(`error while connecting to DB ${e}`);
})
app.use(cookieParser())
app.use(express.json())


app.use(useRoutes)



app.listen(10000,()=>{
    console.log(`Server is up at port ${process.env.PORT}`);
    
})