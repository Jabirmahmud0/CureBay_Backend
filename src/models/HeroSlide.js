const mongoose = require("mongoose");

const HeroSlideSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    subtitle: {
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
    buttonText: {
        type: String,
        required: true
    },
    buttonLink: {
        type: String,
        default: '#'
    },
    active: {
        type: Boolean,
        default: true
    },
    backgroundColor: {
        type: String,
        default: 'from-cyan-500 to-blue-500'
    },
    lightBackground: {
        type: String,
        default: 'from-cyan-50 to-blue-50'
    },
    textColor: {
        type: String,
        default: 'text-white'
    },
    lightTextColor: {
        type: String,
        default: 'text-gray-900'
    },
    featured: {
        medicine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medicine'
        }
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Add a virtual property to maintain frontend compatibility
HeroSlideSchema.virtual('isActive').get(function() {
    return this.active;
});

// Add a virtual setter to maintain frontend compatibility
HeroSlideSchema.virtual('isActive').set(function(value) {
    this.active = value;
});

module.exports = mongoose.model('HeroSlide', HeroSlideSchema);