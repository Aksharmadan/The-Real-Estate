const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async(req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async(req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async(req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        };

        const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async(req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Save/Unsave property
// @route   PUT /api/users/save-property/:propertyId
// @access  Private
exports.toggleSaveProperty = async(req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const propertyId = req.params.propertyId;

        const index = user.savedProperties.indexOf(propertyId);

        if (index > -1) {
            // Property already saved, remove it
            user.savedProperties.splice(index, 1);
        } else {
            // Property not saved, add it
            user.savedProperties.push(propertyId);
        }

        await user.save();

        res.status(200).json({
            success: true,
            data: user.savedProperties,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get saved properties
// @route   GET /api/users/saved-properties
// @access  Private
exports.getSavedProperties = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('savedProperties');

        res.status(200).json({
            success: true,
            data: user.savedProperties,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};