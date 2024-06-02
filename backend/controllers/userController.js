const asyncHandler = require("express-async-handler");
const { joiVelidation, userModel } = require("../models/userModel");

const register = asyncHandler(async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        if (user) {
            return res.status(500).json({ message: "Email already in use." })
        }
        const error = joiVelidation({ email, name, password });
        if (error) {
            return res.status(500).json({ message: error.message });
        }
        const User = await userModel({ name, email, password });
        await User.save();
        res.status(200).json({ message: "Signup successfully.", result: User });
    } catch (error) {
        res.status(500).json("signup error", error.message);
    }
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!password||!email){
        return res.status(500).json({message:"email and password is required."})
    }
    const user = await userModel.findOne({ email: email });
    if (!user) {
        return res.status(500).json({ message: "User not found." });
    }

    const velidatePassword =await user.isPasswordCorrect(password);
    if (!velidatePassword) {
        return res.status(500).json({ message: "Password is incorrect." });
    }

    const loggedUser=await userModel.findOne({email}).select("-password");
    res.status(200).json({message:"User login successfully.",loggedUser:loggedUser})
})
module.exports = {register,login};