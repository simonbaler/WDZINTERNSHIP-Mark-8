const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendOTP, verifyOTP, isValidIndianPhoneNumber } = require('../services/otpService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Simple in-memory user store for demo purposes
// In production, use a persistent database and proper user model
const users = [];

function findUserByEmail(email) {
    return users.find(u => u.email === email.toLowerCase());
}

// Request OTP
router.post('/request-otp',
    body('phoneNumber')
        .trim()
        .notEmpty()
        .custom((value) => {
            if (!isValidIndianPhoneNumber(value)) {
                throw new Error('Please enter a valid Indian phone number (+91XXXXXXXXXX)');
            }
            return true;
        }),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { phoneNumber } = req.body;
            await sendOTP(phoneNumber);
            
            res.json({ 
                success: true, 
                message: 'OTP sent successfully' 
            });
        } catch (error) {
            console.error('Error in request-otp:', error);
            res.status(500).json({ 
                success: false, 
                message: error.message || 'Error sending OTP' 
            });
        }
    }
);

// Verify OTP and login/register
router.post('/verify-otp',
    body('phoneNumber')
        .trim()
        .notEmpty()
        .custom((value) => {
            if (!isValidIndianPhoneNumber(value)) {
                throw new Error('Please enter a valid Indian phone number (+91XXXXXXXXXX)');
            }
            return true;
        }),
    body('otp')
        .trim()
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .isNumeric(),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { phoneNumber, otp } = req.body;
            const isValid = verifyOTP(phoneNumber, otp);

            if (!isValid) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid or expired OTP' 
                });

                // Email/password registration
                router.post('/register',
                    body('email').isEmail().withMessage('Please provide a valid email'),
                    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
                    async (req, res) => {
                        try {
                            const errors = validationResult(req);
                            if (!errors.isEmpty()) {
                                return res.status(400).json({ success: false, errors: errors.array() });
                            }

                            const { email, password, metadata } = req.body;
                            if (findUserByEmail(email)) {
                                return res.status(400).json({ success: false, message: 'Email already registered' });
                            }

                            const hashed = bcrypt.hashSync(password, 10);
                            const id = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
                            const newUser = {
                                id,
                                email: email.toLowerCase(),
                                passwordHash: hashed,
                                metadata: metadata || {}
                            };
                            users.push(newUser);

                            // Issue JWT
                            const token = jwt.sign({ userId: id, email: newUser.email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '24h' });

                            return res.json({ success: true, message: 'User registered', user: { id: newUser.id, email: newUser.email, metadata: newUser.metadata }, session: { access_token: token } });
                        } catch (error) {
                            console.error('Error in register:', error);
                            return res.status(500).json({ success: false, message: 'Error registering user' });
                        }
                    }
                );

                // Email/password login
                router.post('/login',
                    body('email').isEmail().withMessage('Please provide a valid email'),
                    body('password').notEmpty().withMessage('Password is required'),
                    async (req, res) => {
                        try {
                            const errors = validationResult(req);
                            if (!errors.isEmpty()) {
                                return res.status(400).json({ success: false, errors: errors.array() });
                            }

                            const { email, password } = req.body;
                            const user = findUserByEmail(email);
                            if (!user) {
                                return res.status(400).json({ success: false, message: 'Invalid email or password' });
                            }

                            const match = bcrypt.compareSync(password, user.passwordHash);
                            if (!match) {
                                return res.status(400).json({ success: false, message: 'Invalid email or password' });
                            }

                            const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'dev_secret', { expiresIn: '24h' });

                            return res.json({ success: true, message: 'Login successful', user: { id: user.id, email: user.email, metadata: user.metadata }, session: { access_token: token } });
                        } catch (error) {
                            console.error('Error in login:', error);
                            return res.status(500).json({ success: false, message: 'Error during login' });
                        }
                    }
                );
            }

            // Generate JWT token
            const token = jwt.sign(
                { phoneNumber },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                success: true,
                message: 'OTP verified successfully',
                token
            });
        } catch (error) {
            console.error('Error in verify-otp:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error verifying OTP' 
            });
        }
    }
);

module.exports = router;