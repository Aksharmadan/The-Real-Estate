const express = require('express');
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    toggleSaveProperty,
    getSavedProperties,
} = require('../controllers/userController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(authorize('admin'), getUsers);

router.route('/:id')
    .get(getUser)
    .put(updateUser)
    .delete(authorize('admin'), deleteUser);

router.put('/save-property/:propertyId', toggleSaveProperty);
router.get('/saved-properties', getSavedProperties);

module.exports = router;