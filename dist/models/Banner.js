"use strict";
const mongoose = require("mongoose");
const BannerSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: '#'
    },
    active: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        default: null
    },
    endDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Add a virtual property to maintain frontend compatibility
BannerSchema.virtual('isActive').get(function () {
    return this.active;
});
// Add a virtual setter to maintain frontend compatibility
BannerSchema.virtual('isActive').set(function (value) {
    this.active = value;
});
// Add a virtual property for priority to maintain frontend compatibility
BannerSchema.virtual('priority').get(function () {
    return this.order;
});
// Add a virtual setter for priority to maintain frontend compatibility
BannerSchema.virtual('priority').set(function (value) {
    this.order = value;
});
module.exports = mongoose.model('Banner', BannerSchema);
