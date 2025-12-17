const express = require('express');
const {
  getInquiries,
  createInquiry,
  updateInquiry,
  deleteInquiry,
} = require('../controllers/inquiryController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getInquiries)
  .post(createInquiry);

router.route('/:id')
  .put(updateInquiry)
  .delete(deleteInquiry);

module.exports = router;
