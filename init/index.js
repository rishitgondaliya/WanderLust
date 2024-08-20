const mongoose = require("mongoose");
const initData = require('./data')
const Listing = require('../models/listing')

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

const initDB = async () => {
    await Listing.deleteMany({})
    await Listing.insertMany(initData.data)
    console.log("data is initialized")
}

initDB()