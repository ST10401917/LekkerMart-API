const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const users = require("../data/users");
const User = require("../models/userModel");
// const loggedInUsers = require("../data/loginSessions");

const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Check required fields
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Name, email, password and role are required"
            });
        }

        // Only allow these roles
        const allowedRoles = ["user", "admin"];

        if (!allowedRoles.includes(role.toLowerCase())) {
            return res.status(400).json({
                success: false,
                message: "Invalid role. Role must be user or admin"
            });
        }

        // Check if email already exists
        const existingUser = users.find(
            user => user.email.toLowerCase() === email.toLowerCase()
        );

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const newUser = new User(
            users.length + 1,
            name,
            email.toLowerCase(),
            hashedPassword,
            role.toLowerCase()
        );

        // Save user
        users.push(newUser);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        next(error);
    }
};


const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user
        const user = users.find(
            user => user.email.toLowerCase() === email.toLowerCase()
        );

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Check password
        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        

        // Check if already logged in
        // const alreadyLoggedIn = loggedInUsers.find(
        //     session => session.userId === user.id
        // );

        // if (alreadyLoggedIn) {
        //     return res.status(409).json({
        //         success: false,
        //         message: "User is already logged in"
        //     });
        // }


        


        // Create JWT
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );

        // Store login session
        // loggedInUsers.push({
        //     userId: user.id,
        //     token: token
        // });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    register,
    login
};