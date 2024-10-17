const express = require('express');
const connectDB = require("./config/database");

const app = express();
const User = require("./models/user")
const {validateSignUpData} = require("./utils/validation")
const bcrypt = require("bcrypt")
app.use(express.json());   //middleware to conver json into readable js object

app.post("/signup",async (req,res)=>{

    
    try{
        // validation of data

        console.log(req.body);
        validateSignUpData(req);
        //encrypt the password

        const {firstName, lastName, emailId, password}= req.body;
        const passwordHash = await bcrypt.hash(password, 10 )
        console.log(passwordHash)

        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash,
        });
        //create new instance of user models
        // const user = new User(userObj);

        await user.save();
        res.send("User added")
    } catch(err){
        res.status(400).send("Error saving user "+ err.message);
    }
   
})

app.post("/login", async (req, res)=>{
    try {

        const {emailId, password} = req.body;
        
        const user = await User.findOne({ emailId: emailId})
        if(!user){
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await bcrypt.compare(password,user.password);

        if(isPasswordValid){
            res.send("Login successful")
        }
        else {
            throw new Error("Password is not correct")
        }
        
    } catch (err) {
        res.status(400).send("Something went wrong" + err.message)

    }
})
//get user by email

app.get("/user", async (req,res)=>{
    const userEmail = req.body.emailId;
    try {
        
        const users = await User.findOne({emailId: userEmail});
        if(users.length === 0){
            res.status(404).send("User not found")
        }
        else{
            res.send(users);

        }
        
    } catch (err) {
        res.status(400).send("Something went wrong")
    }

})
//Feed api - get /feed - get all users form database
app.get("/feed", async (req,res)=>{

    try {
        const users = await User.find({});
        res.send(users);
    } catch (err) {
        res.status(400).send("something went wrong")
        
    }
})

app.delete("/user", async (req,res)=>{

    const userId = req.body.userId;
    try {
        // const users = await User.findByIdAndDelete({_id: userId});

        const users = await User.findByIdAndDelete(userId);
        res.send("User deleted succesfully");
    } catch (err) {
        res.status(400).send("something went wrong")
        
    }

})

app.patch("/user/:userId", async(req,res)=>{
    const data = req.body;
    const userId = req.params?.userId;

  
    try {
        const ALLOWED_UPDATES = ["photoUrl","about", "gender", "age", "skills"];

        const isUpdatedAllowed = Object.keys(data).every((k)=> ALLOWED_UPDATES.includes(k));
    
        if(!isUpdatedAllowed){
            throw new Error("Updates not allowed");
        }

        if(data?.skills.length >10){
            throw new Error("Skills cannot be more than 10")
        }
        // const users = await User.findByIdAndDelete({_id: userId});
        const user = await User.findByIdAndUpdate({_id:userId}, data, {
            runValidators:true,
        });
        console.log(user)
        res.send("User updated succesfully");
    } catch (err) {
        res.status(400).send("Update failed "+ err.message)
        
    }


})
connectDB().then(()=>{
    console.log("Database connection succes")
}).catch((err)=>{
    console.error("Database connected")
})


app.listen(7777, ()=>{
    console.log("Server is successfully connected")
});