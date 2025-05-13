

// const { MongoClient } = require('mongodb');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();
// const { connectToDatabase } = require('./db');

// exports.loginUser = async (req, res) => {
//     const { loginField, password } = req.body;
//     try {
//         const db = await connectToDatabase();
//         const usersCollection = db.collection('users');
//         const doctorsCollection = db.collection('doctors');

//         const [user, doctor] = await Promise.all([
//             usersCollection.findOne({
//                 $or: [
//                     { email: loginField },
//                     { username: loginField },
//                     { Mobile: loginField }
//                 ]
//             }),
//             doctorsCollection.findOne({
//                 $or: [
//                     { email: loginField },
//                     { username: loginField },
//                     { Mobile: loginField }
//                 ]
//             })
//         ]);

//         const loginUser = doctor || user;
//         const userType = doctor ? 'doctor' : 'user';

//         if (!loginUser) return res.status(400).json({ message: 'Account not found' });
//         if (doctor && !doctor.isApproved) return res.status(403).json({ message: 'Doctor account pending approval' });
//         if (!loginUser.isActive) return res.status(400).json({ message: 'Account inactive. Verify your email.' });

//         const isPassword = await bcrypt.compare(password, loginUser.password);
//         if (!isPassword) return res.status(400).json({ message: 'Invalid password' });

//         const token = jwt.sign(
//             {
//                 id: loginUser._id,
//                 email: loginUser.email,
//                 name: loginUser.name,
//                 admin: loginUser.isAdmin,
//                 name: loginUser.name,
//                 role: userType,
//                 specialty: doctor ? doctor.specialty : null
//             },
//             process.env.JWT_SECRET,
//             { expiresIn: '4h' }
//         );

//         res.cookie('token', token, {
//             expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
//         });

//         res.status(200).json({ message: 'Login Successful', token });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
require('dotenv').config();
const { connectToDatabase } = require('./db');

// Joi schema for login validation
const loginSchema = Joi.object({
    loginField: Joi.string().required().messages({
        'any.required': 'Login field is required',
        'string.empty': 'Login field cannot be empty'
    }),
    password: Joi.string().min(6).required().messages({
        'any.required': 'Password is required',
        'string.min': 'Password must be at least 6 characters long'
    })
});

exports.loginUser = async (req, res) => {
    const { loginField, password } = req.body;

    // Validate input
    const { error } = loginSchema.validate({ loginField, password });
    if (error) {
        return res.status(400).json({ message: 'Validation Error', error: error.details[0].message });
    }

    try {
        const db = await connectToDatabase();
        const usersCollection = db.collection('users');
        const doctorsCollection = db.collection('doctors');

        const [user, doctor] = await Promise.all([
            usersCollection.findOne({
                $or: [
                    { email: loginField },
                    { username: loginField },
                    { Mobile: loginField }
                ]
            }),
            doctorsCollection.findOne({
                $or: [
                    { email: loginField },
                    { username: loginField },
                    { Mobile: loginField }
                ]
            })
        ]);

        const loginUser = doctor || user;
        const userType = doctor ? 'doctor' : 'user';

        if (!loginUser) return res.status(400).json({ message: 'Account not found' });
        if (doctor && !doctor.isApproved) return res.status(403).json({ message: 'Doctor account pending approval' });
        if (!loginUser.isActive) return res.status(400).json({ message: 'Account inactive. Verify your email.' });

        const isPassword = await bcrypt.compare(password, loginUser.password);
        if (!isPassword) return res.status(400).json({ message: 'Invalid password' });

        const token = jwt.sign(
            {
                id: loginUser._id,
                email: loginUser.email,
                name: loginUser.name,
                admin: loginUser.isAdmin,
                role: userType,
                specialty: doctor ? doctor.specialty : null
            },
            process.env.JWT_SECRET,
            { expiresIn: '4h' }
        );

        res.cookie('token', token, {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
        });

        res.status(200).json({ message: 'Login Successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
