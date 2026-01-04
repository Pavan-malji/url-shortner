const express=require("express");
const app=express();
const connectToDatabase=require("./connection");
const urlRouter=require("./routes/url");
const URL=require("./models/url");
const PORT=8001;

connectToDatabase("mongodb://127.0.0.1:27017/short-url").then(()=>{
    console.log("Connected to database");
});

app.use(express.json());
app.use("/url", urlRouter);

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
    res.redirect(entry.redirectUrl);
});

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});
