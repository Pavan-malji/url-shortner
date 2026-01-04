const shortid = require("shortid");
const Url = require("../models/url");
async function handleGenerateNewShortUrl(req, res){
    const body = req.body;
    if(!body.url) return res.status(400).json({error:"url is required"});
    const shortId = shortid.generate();
    await Url.create({
        shortId: shortId,
        redirectUrl: body.url,
        visitHistory: [],
    });
    return res.json({id: shortId});
}

async function handleGetUrlAnalytics(req, res){
    const shortId = req.params.shortId;
    const urlEntry = await Url.findOne({shortId});
    if(!urlEntry) return res.status(404).json({error:"Short URL not found"});
    return res.json({
        totalClicks:urlEntry.visitHistory.length,
        analytics:urlEntry.visitHistory,
    });
}
module.exports = {handleGenerateNewShortUrl, handleGetUrlAnalytics};