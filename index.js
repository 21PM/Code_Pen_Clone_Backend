const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const useRoutes = require("./routes/useroutes")
const workRoutes = require("./routes/workRoutes")
const followingRoutes = require('./routes/FollowingRoutes')
const cookieParser = require("cookie-parser")
const cors = require('cors');

dotenv.config()
const app = express();


mongoose.connect("mongodb://localhost:27017/codePen")
.then(()=>{
    console.log("DB has been connected");
}).catch((e)=>{
    console.log(`error while connecting to DB ${e}`);
})

app.use(cors({
    origin: 'http://localhost:5173', // Update with your frontend domain
    credentials: true,
}));

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', req.headers.origin); // Allow all origins
//     res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials
//     res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE'); // Allowed methods
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization'); // Allowed headers
//     next();
// });
app.use(cookieParser())
app.use(express.json())


app.use(useRoutes)
app.use(workRoutes)
app.use(followingRoutes)


app.listen(10000,()=>{
    console.log(`Server is up at port ${process.env.PORT}`);
    
})