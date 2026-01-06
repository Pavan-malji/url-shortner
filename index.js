const express=require("express");
const connectToDatabase=require("./connection");
const URL=require("./models/url");
const path=require("path");
const { allowedNodeEnvironmentFlags } = require("process");
const cookieParser=require("cookie-parser");
const {restrictToLoggedInUsersOnly}=require("./middlewares/auth");
const {checkAuth}=require("./middlewares/auth");
const app=express();
const PORT=8001;


const staticRoute=require("./routes/staticRouter");
const urlRouter=require("./routes/url");
const userRouter=require("./routes/user");



connectToDatabase("mongodb://127.0.0.1:27017/short-url").then(()=>{
    console.log("Connected to database");
});

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());


app.use("/url", restrictToLoggedInUsersOnly, urlRouter);
app.use("/user", userRouter);
app.use("/",checkAuth, staticRoute);
app.set("view engine","ejs");

app.set("views",path.resolve("./views"));

app.get("/test",async (req,res)=>{
    const allUrl=await URL.find({});
    res.render("home",{url:allUrl})
});


app.get('/:shortId',async (req,res)=>{
    const shortId=req.params.shortId;
    const entry=await URL.findOneAndUpdate(
    {
        shortId,
    },
    {
        $push:{
        visitHistory:{
            timestamp:Date.now(),
        },
        },
    }
    );
    if(!entry){
        return res.status(404).send("Short URL not found");
    }
    res.redirect(entry.redirectUrl);
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
