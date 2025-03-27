const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { sendOTP } = require('../utils/nodeMailer')
const { connectRedis } = require('../utils/redisClient')
require('dotenv').config()

const registerUser = async (req, res)=>{
    const {name, email, password} = req.body
    const secureName = typeof name === 'string' ? name.trim() : '';
    const secureEmail = typeof email === 'string' ? email.trim() : '';
    const securePassword = typeof password === 'string' ? password.trim() : '';

    // email exist ayithe edi vacheyala
    const emailExist = await User.findOne({email:secureEmail})
    if(emailExist){
        console.log('email exist')
        return res.status(401).json({message:"email already exist please try another email"})
    }
    // all secure filds emty ayithe edi vastundi
    if (!secureName || !secureEmail || !securePassword) {
        return res.status(400).json({message:"name, email and password is required"})
    }
    const maxAge = 1000 *60 *60 *24 // 24 hours
    // jwt ki fun create chesanu
    const jwtFun = (_id)=>{
        console.log(process.env.secret_key)
        return (
            
            jwt.sign({_id}, process.env.secret_key, {expiresIn:maxAge}) // payload ante first parameter in jwt.sign() lo object undali
        )
    }

    try {
        const hashedPassword = await bcryptjs.hash(securePassword, 10)
        const user = await User.create({
            name:secureName,
            email: secureEmail,
            password: hashedPassword
        })

        return res.status(201).cookie('user_jwt', jwtFun(user._id),
        {maxAge, secure:true, sameSite:"none"}).json({user})
        
    } catch (error) {
        console.log(error)
        return res.status(501).json({message:error.message})
        
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const secureEmail = typeof email === 'string' ? email.trim() : '';
    const securePassword = typeof password === 'string' ? password.trim() : '';
    if (!secureEmail || !securePassword) {
        return res.status(401).json({ message: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email: secureEmail });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcryptjs.compare(securePassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const maxAge = 1000 * 60 * 60 * 24; // 24 hours
        const jwtFun = (_id) => jwt.sign({ _id }, process.env.secret_key, { expiresIn: maxAge });

        return res.status(201).cookie('user_jwt', jwtFun(user._id), {
            maxAge,
            secure: true,
            sameSite: 'none'
        }).json({ user });

    } catch (error) {
        console.error(error);
        return res.status(501).json({ message: error.message });
    }

}

// get user details
const getUser = async(req, res)=>{
    const userId = req.userId;
    if(!userId) return res.status(401).json({success:false, message:"user Id required"})
    
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.status(201).json({ success: true, user });
        
    } catch (error) {
        console.error(error)
        return res.status(501).json({success:false, message:"Internal server error"})
        
    }
}

// logOut controller

const logoutUser = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) return res.status(400).json({ success: false, message: "User ID not found" });
        

        res.clearCookie("user_jwt", { httpOnly: true, secure: true, sameSite: 'strict' });
        res.status(200).json({ success: true, message: "successfully you are logout" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error try again" });
    }
};

// otp controller
const otpSend = async (req, res) => {
    // const userId = req.userId;
    const { email } = req.body;
    if ( !email) return res.status(401).json({ success: false, message: "User ID and email required" });
    try {
        // const user = await User.findById(userId);
        // if (!user) return res.status(401).json({ success: false, message: "User not found" });
        const otp = await sendOTP(email);
        const redis =await connectRedis();
        redis.set(email, otp, {EX: 600});

        return res.status(201).json({ success: true, message: "OTP sent successfully", otp});

    }
    catch (error) {
        console.error(error);
        return res.status(501).json({ success: false,message:"internal server error"});

    }
}
// otp verify controller
const otpVerify = async (req, res) => {
    // const userId = req.userId;
    const { email, otp } = req.body;
    if ( !email || !otp) return res.status(401).json({ success: false, message: "User ID, email and OTP required" });
    try {
        // const user = await User.findById(userId);
        // if (!user) return res.status(401).json({ success: false, message: "User not found" });
        const redis = await connectRedis();
        const storedOtp = await redis.get(email);
        
        if (storedOtp !== otp) return res.status(401).json({ success: false, message: "Invalid OTP" });
        return res.status(201).json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        return res.status(501).json({ success: false, message:"internal server error" });
    }
}





module.exports = {  registerUser, 
                    loginUser,
                    logoutUser, 
                    getUser,
                    otpSend,
                    otpVerify,
                };

