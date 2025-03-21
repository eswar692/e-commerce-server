const User = require('../models/User')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
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
        return res.status(401).json({message:"email already exist plase try another email"})
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
module.exports = {registerUser, loginUser}