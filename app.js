const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const Listing = require('./models/listing');
const { title } = require("process");

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "public")))
app.use(express.urlencoded({extended: true}))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate)

main()
.then((res) => {
    console.log("conneted to DB");
})
.catch((err) => {
    console.log("failed to connect!");
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/", (req, res) => {
  res.send("root is working");
});

// index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({})
    res.render("listings/index.ejs", {allListings})
})

// create new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs")
})

app.post("/listings", async (req, res) => {
    const newListing = new Listing(req.body.listing)
    newListing.save()
    res.redirect("/listings")
})

// show route
app.get("/listings/:id", async(req, res) => {
    let id = req.params.id
    const listing = await Listing.findById(id)
    res.render("listings/show.ejs", {listing})
})

// edit route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params
    const listing = await Listing.findById(id)
    res.render("listings/edit.ejs", {listing})
})

// update route
app.put("/listings/:id", async (req, res) => {
    let {id} = req.params
    await Listing.findByIdAndUpdate(id, {...req.body.listing})
    res.redirect("/listings")
})

// delete route
app.delete("/listings/:id/delete", async (req, res) => {
    let {id} = req.params
    await Listing.findByIdAndDelete(id)
    res.redirect("/listings")
})

app.listen(8080, () => {
  console.log("server is running on http://localhost:8080");
});
