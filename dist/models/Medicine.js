"use strict";
const mongoose = require("mongoose");
const MedicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    genericName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    massUnit: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inStock: {
        type: Boolean,
        default: true
    },
    stockQuantity: {
        type: Number,
        default: 0,
        min: 0
    },
    isAdvertised: {
        type: Boolean,
        default: false
    },
    // Add time-based discount fields
    discountStartDate: {
        type: Date,
        default: null
    },
    discountEndDate: {
        type: Date,
        default: null
    },
    // Add discount type field for future enhancements
    discountType: {
        type: String,
        enum: ['percentage', 'fixed', 'buy_x_get_y'],
        default: 'percentage'
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('Medicine', MedicineSchema);
