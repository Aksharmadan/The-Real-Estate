const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    price: {
        type: Number,
        required: [true, 'Please add a price'],
    },
    address: {
        street: String,
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zipCode: String,
        country: {
            type: String,
            default: 'India',
        },
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
            index: '2dsphere',
        },
        formattedAddress: String,
    },
    propertyType: {
        type: String,
        required: true,
        enum: ['apartment', 'villa', 'house', 'land', 'commercial'],
    },
    listingType: {
        type: String,
        required: true,
        enum: ['sale', 'rent'],
    },
    bedrooms: {
        type: Number,
        required: true,
    },
    bathrooms: {
        type: Number,
        required: true,
    },
    area: {
        type: Number,
        required: [true, 'Please add area in square feet'],
    },
    amenities: [{
        type: String,
    }],
    images: [{
        url: String,
        public_id: String,
    }],
    panoramicImages: [{
        url: String,
        public_id: String,
        roomName: String,
    }],
    featured: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'rented', 'pending'],
        default: 'available',
    },
    views: {
        type: Number,
        default: 0,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    ratings: {
        average: {
            type: Number,
            default: 0,
        },
        count: {
            type: Number,
            default: 0,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create index for text search
PropertySchema.index({
    title: 'text',
    description: 'text',
    'address.city': 'text',
    'address.state': 'text'
});

module.exports = mongoose.model('Property', PropertySchema);