"use strict";
const mongoose = require("mongoose");
const PaymentSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    currency: {
        type: String,
        required: true,
        default: 'usd'
    },
    status: {
        type: String,
        enum: ['pending', 'succeeded', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentIntentId: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        default: null
    },
    cardBrand: {
        type: String,
        default: null
    },
    cardLast4: {
        type: String,
        default: null
    },
    // Add sellerId field to directly link payments to sellers
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
// Create indexes for better query performance
PaymentSchema.index({ sellerId: 1 });
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ paymentIntentId: 1 }, { unique: true });
PaymentSchema.index({ createdAt: -1 });
module.exports = mongoose.model('Payment', PaymentSchema);
