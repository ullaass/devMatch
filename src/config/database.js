const mongoose = require("mongoose");


const connectDB = async () => {
    await mongoose.connect("mongodb+srv://lavichandrakar:passwordLavi@cluster0.fqhmg.mongodb.net/devTinder")
}

module.exports = connectDB;


