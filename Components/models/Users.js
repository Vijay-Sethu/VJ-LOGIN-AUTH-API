const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        unique: true,
        minlenght: 6
    }
}, {
    timestamps: true,
    versionKey: false
})

module.exports = mongoose.model("user", UserSchema)