const express = require('express');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getFeaturedProperties,
  getSimilarProperties,
  getPropertyStats,
  getPropertiesWithTours,
} = require('../controllers/propertyController');

const { protect, authorize } = require('../middleware/auth');

// Include other resource routers
const reviewRouter = require('./reviews');

const router = express.Router();

// Re-route into other resource routers
router.use('/:propertyId/reviews', reviewRouter);

router.route('/featured')
  .get(getFeaturedProperties);

router.route('/with-tours')
  .get(getPropertiesWithTours);

router.route('/stats')
  .get(protect, authorize('admin'), getPropertyStats);

router.route('/')
  .get(getProperties)
  .post(protect, authorize('agent', 'admin'), createProperty);

router.route('/:id')
  .get(getProperty)
  .put(protect, authorize('agent', 'admin'), updateProperty)
  .delete(protect, authorize('agent', 'admin'), deleteProperty);

router.route('/:id/similar')
  .get(getSimilarProperties);

module.exports = router;
