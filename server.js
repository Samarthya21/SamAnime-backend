const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 6969;
app.use(express.json());
app.use(cors());

const user_model = require("./schema.js");
const { default: mongoose } = require('mongoose');

app.listen(PORT,()=>{
    console.log("Server started on port 6969");
})

app.post("/server/login", async (req, res) => {
    try {
        console.log("Received post request from login")
        let obj= req.body
        if (!obj.userId) {
            console.log("User id not present")
             res.json({
                 message: "User id not found",
                 data:obj
                })
            return;
        }
        if (!obj.password) {
            console.log("User password not present")
             res.json({
                 message: "User password not found",
                 data:obj
                })
            return;
        }
       
        let userId = obj.userId;
        let password = obj.password;

        if (password < 8) {
            console.log("User password length is less than 8");
            res.json({
                message:"User password length is less than 8",
            })
            return;
        }
        
        const user = await user_model.findOne({ userId: userId });

        if (!user) {
            console.log("User id not found")
            res.json({
                message:"User id not found"
            })
            return;
        }
        else {
            if (user.password === password) {
                console.log("Login Successful")
                res.json({
                    message: "Login Successful",
                    data:user.userId,
                })
                return;
            }
            else {
                console.log("User password does not match")
                res.json({
                    message:"User password does not match"
                })
                return;
            }
        }

    }
    catch (err) {
        console.log(err);
    }
})
app.post("/server/signup", async (req, res) => {
    console.log("Received post request from signup")
    let obj = req.body;
    console.log(obj);
    let {userId,password}=req.body;
    if (!userId || !password) {
        console.log("Password or UserID is empty");
        
        res.json({
            message: "UserId or Password is empty",
            data: obj
        })
        return;
    }
    else {
        if (await user_model.findOne({ userId: userId })) {
            console.log("UserId already in database , no need to signup")
            
            res.json({
                message: "User already in the database",
                data: obj
            })
            return;
        }
        else {
            console.log("User signup successful");
            /*Encryption of password using salt and hashing - bcrypt library
            const salt = await bcrypt.genSalt(10);
            const hash= await bcrypt.hash(password,salt);*/
            
            let user = await user_model.create({ userId: userId, password: password });
            console.log({ message: obj });
            res.json({
                message: "user signup done",
                data: obj,
            });
            return;
        }
    }

})

app.post("/server/mytitles", async ( req, res )=> {
    
         
        const userId = req.body.userId;
        const titles = req.body.titles;
        const images = req.body.images;
        const uniqueTitles = new Set(titles);
        const uniqueTitlesArray = Array.from(uniqueTitles);
        const uniqueImages = new Set(images);
        const uniqueImagesArray = Array.from(uniqueImages);
        
   
    
        try {
            const updatedUser = await user_model.findOneAndUpdate(
                { userId: userId },
                {
                    $addToSet: {
                        selectedtitlesarray: { $each: uniqueTitlesArray },
                        selectedimagesarray: { $each: uniqueImagesArray }
                    }
                },
                { new: true }
            );
            console.log(updatedUser.selectedimagesarray);
            console.log(updatedUser.selectedtitlesarray);
    
            
        } catch (err) {
            console.log("Something went wrong when updating the data!", err);
        }
});
    
app.post("/server/getMyTitles", async (req, res) => {
    const userId = req.body.userId;
    console.log("Received post request from getMyTitles for userId:", userId);
    try {
        const user = await user_model.findOne({ userId: userId });
        const titles = user.selectedtitlesarray;
        const images = user.selectedimagesarray;
        console.log(titles);
        res.json({
            message: "Titles fetched successfully",
            titles: titles,
            images:images,
        });
        
    }
    catch (err) {
        console.log("Error while fetching data from database", err);
    }
});

app.post("/server/removeTitle", async (req, res) => { 
    const userId = req.body.userId;
    const title = req.body.title;
    const image = req.body.image;
    try {
        const updatedUser = await user_model.findOneAndUpdate(
            { userId: userId },
            {
                $pull: {
                    selectedtitlesarray: title,
                    selectedimagesarray: image
                }
            },
            { new: true }
        );
        console.log(updatedUser.selectedtitlesarray);
        console.log(updatedUser.selectedimagesarray);
        res.json({
            message: "Title removed successfully",
            data: updatedUser
        });
    } catch (err) {
        console.log("Something went wrong when updating the data!", err);
    }
});