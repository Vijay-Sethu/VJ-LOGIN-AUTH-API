const bcrypt = require('bcryptjs/dist/bcrypt');
const express = require('express');
const { ERROR_CODE, INFO_CODE } = require('../constant');
const router = express.Router();
const User = require("../models/Users");
const jwt = require('jsonwebtoken');

// validate user for if token in or not when get all users
const validUuser = (req, res, next) => {
    var token = req.header('authToken');
    req.token = token;
    next(); //we can use this method another function
}

// GET all Users
router.get('/users', validUuser, async(req, res) => {
    try{
        jwt.verify(req.token, 'VJSECRETKEY', async(err, data) => {
            if(err) {
                res.status(403).send({error: ERROR_CODE[1000]})
            } else {
                const data = await User.find().select(['-password']); // show the all users data without password
                res.status(200).send(data);
            }
        })

    } catch(err) {
        res.status(500).send({error: ERROR_CODE[1000]})
    }
})

// GET User by Id
router.get('/user/:id', async (req, res) => {
    try {
        await User.findById(req.params.id)
        .then((result) => {
            res.status(200).send(result)
        }).catch((err) => {
            res.status(400).send({error: err})
        })
    } catch(err) {
        res.status(500).send({error: ERROR_CODE[1000]})
    }
})

// User Registration SignUp
router.post('/signup', async (req, res) => {
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(user){
            res.status(400).send({error: INFO_CODE[2000]})
        }
        if(password.length < 6) {
            res.status(400).send({error: ERROR_CODE[1001]})
        }
        user = new User({email, password});
        const salt = await bcrypt.genSalt(10); 
        user.password = await bcrypt.hash(password, salt);
        res.status(200).send(user)
        user.save();
    } catch(error){
        res.status(500).send({error: ERROR_CODE[1002]});
    }
});


// User Login
router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user) {
            res.status(400).send({error: ERROR_CODE[1003]})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            res.status(400).send({error: ERROR_CODE[1004]})
        }
        var userToken = jwt.sign({email: user.email, password: user.password}, 'VJSECRETKEY', {expiresIn: "1h"});
        res.header('authToken', userToken);
        res.status(200).send({message: INFO_CODE[2001], userToken})
    } catch(error) {
        res.status(500).send({error: ERROR_CODE[1005]})
    }
})

// User Forgot Password
router.put('/signup/reset/:id', async (req, res) => {
    const {email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(!user){
            res.status(400).send({error: ERROR_CODE[1006]})
        } else {
            if(password.length < 6) {
                res.status(400).send({error: ERROR_CODE[1001]})
            }
            let restId = await User.findByIdAndUpdate(req.params.id, {password});
            const salt = await bcrypt.genSalt(10);
            restId.password = await bcrypt.hash(password, salt);
            res.status(200).send(restId)
            restId.save();
        }

    } catch(err) {
        res.status(500).send({error: ERROR_CODE[1005]})
    }
})




module.exports = router