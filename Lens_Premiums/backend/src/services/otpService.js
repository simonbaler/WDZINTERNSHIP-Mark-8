const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);

// Store OTPs in memory (in production, use Redis or similar)
const otpStore = new Map();

// Function to validate Indian phone number
const isValidIndianPhoneNumber = (phone) => {
    const indianPhoneRegex = /^\+91[6-9]\d{9}$/;
    return indianPhoneRegex.test(phone);
};

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP via Twilio
const sendOTP = async (phoneNumber) => {
    try {
        // Validate Indian phone number
        if (!isValidIndianPhoneNumber(phoneNumber)) {
            throw new Error('Invalid phone number. Please enter a valid Indian phone number (+91XXXXXXXXXX)');
        }

        const otp = generateOTP();
        const message = `Your Camera Glaze verification code is: ${otp}`;

        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE,
            to: phoneNumber
        });

        // Store OTP with 5 minutes expiry
        otpStore.set(phoneNumber, {
            otp,
            expiry: Date.now() + 5 * 60 * 1000 // 5 minutes
        });

        return true;
    } catch (error) {
        console.error('Error sending OTP:', error);
        throw error;
    }
};

// Verify OTP
const verifyOTP = (phoneNumber, otp) => {
    const storedData = otpStore.get(phoneNumber);
    
    if (!storedData) {
        return false;
    }

    if (Date.now() > storedData.expiry) {
        otpStore.delete(phoneNumber);
        return false;
    }

    if (storedData.otp === otp) {
        otpStore.delete(phoneNumber);
        return true;
    }

    return false;
};

module.exports = {
    sendOTP,
    verifyOTP,
    isValidIndianPhoneNumber
};