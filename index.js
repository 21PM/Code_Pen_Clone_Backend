const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const useRoutes = require("./routes/useroutes");
const workRoutes = require("./routes/workRoutes");
const followingRoutes = require('./routes/FollowingRoutes');
const cookieParser = require("cookie-parser");
const cors = require('cors');

dotenv.config();
const app = express();

mongoose.connect(process.env.MongoURL)
    .then(() => {
        console.log("DB has been connected");
    }).catch((e) => {
        console.log(`Error while connecting to DB ${e}`);
    });

const allowedOrigins = [
    'https://code-pen-clone-frontend.vercel.app',
    'https://code-pen-clone-frontend-edvi09kzk-21pms-projects.vercel.app'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use(cookieParser());
app.use(express.json());

app.use(useRoutes);
app.use(workRoutes);
app.use(followingRoutes);

app.options('*', (req, res) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.sendStatus(204);
});

app.listen(10000, () => {
    console.log(`Server is up at port ${process.env.PORT}`);
});
