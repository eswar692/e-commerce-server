const nodemailer = require('nodemailer');

// Function to generate a 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Function to send OTP via email
async function sendOTP(email) {
    const otp = generateOTP();

    // Configure the transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: 'digitallogic469@gmail.com', 
            pass: 'pblfdomvantedzwt'  
        }
    });

    // Email options
    const mailOptions = {
        from: 'digitallogic469@gmail.com', 
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}: ${otp}`);
        return otp; 
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
}

module.exports = { sendOTP };












