"use strict";
// models/User.js
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    role: {
        type: String,
        enum: ['user', 'seller', 'admin'],
        default: 'user',
    },
    profilePicture: String,
    phone: String,
    address: String,
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
module.exports = mongoose.model("User", userSchema);
