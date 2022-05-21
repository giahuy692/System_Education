const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let refreshTokens = [];
const authControllers = {
    //REGISTER
    registerUser: async (req, res, next) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt); // mã hóa mật khẩu

            //Create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            //Save to DB
            const user = await newUser.save();
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //generate access token
    generateAccessToken: (user) => {
        return jwt.sign({
            id: user._id,
            admin: user.admin,
        },
        process.env.JWT_ACCESS_KEY,
        {expiresIn: "60s"}
        );
    },

    generateRefreshToken: (user) => {
        return jwt.sign({
            id: user._id,
            admin: user.admin,
        },
        process.env.JWT_REFRESH_KEY,
        {expiresIn: "365d"}
        );
    },

    //Login
    loginUser: async (req, res, next) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) {
                res.status(404).json('Wrong username');
            }

            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password,
            );

            if (!validPassword) {
                res.status(404).json('Wrong password');
            }
            if (user && validPassword) {
                const accessToken = authControllers.generateAccessToken(user);
                const refreshToken = authControllers.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false, 
                    path:"/",
                    sameSite: "strict" //ngăn chặn tấn công csos
                });
                const {password, ...others} = user._doc;
                res.status(200).json({...others,accessToken});
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //REDIS ... Cần tìm hiểu
    requestRefreshToken: async(req,res) => {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json("You're not authenticated");
        if(!refreshTokens.includes){
            return res.status(403).json("Refresh token is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY,(err, user) => {
            if(err){
                console.log(err);
            }
            refreshTokens = refreshTokens.filter((token) => token != refreshToken);
            // Create new accesstoken, refresh token
            const newAccessToken = authControllers.generateAccessToken(user);
            const newRefreshToken = authControllers.generateAccessToken(user);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false, 
                path:"/",
                sameSite: "strict" //ngăn chặn tấn công csos
            })
            res.status(200).json({accessToken : newAccessToken});
        })
    },

    //logout
    userLogout: async(req,res) => {
        res.clearCookies("refreshToken");
        refreshTokens = refreshTokens.filter(
            (token) => token !== req.cookies.refreshToken
        );
        res.status(200).json("Logged out!");
    }
};

module.exports = authControllers;
