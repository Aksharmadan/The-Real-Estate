const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// @desc    Get all inquiries for a user
// @route   GET /api/inquiries
// @access  Private
exports.getInquiries = async (req, res) => {
  try {
    let query;

    if (req.user.role === 'agent' || req.user.role === 'admin') {
      query = { receiver: req.user.id };
    } else {
      query = { sender: req.user.id };
    }

    const inquiries = await Inquiry.find(query)
      .populate('property', 'title price images address')
      .populate('sender', 'name email phone')
      .populate('receiver', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create inquiry
// @route   POST /api/inquiries
// @access  Private
exports.createInquiry = async (req, res) => {
  try {
    const property = await Property.findById(req.body.property).populate('owner');

    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    if (property.owner._id.toString() === req.user.id) {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot inquire about your own property' 
      });
    }

    req.body.sender = req.user.id;
    req.body.receiver = property.owner._id;

    const inquiry = await Inquiry.create(req.body);

    res.status(201).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private
exports.updateInquiry = async (req, res) => {
  try {
    let inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }

    if (inquiry.receiver.toString() !== req.user.id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authorized to update this inquiry' 
      });
    }

    inquiry = await Inquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private
exports.deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }

    if (inquiry.sender.toString() !== req.user.id && 
        inquiry.receiver.toString() !== req.user.id) {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authorized to delete this inquiry' 
      });
    }

    await inquiry.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
