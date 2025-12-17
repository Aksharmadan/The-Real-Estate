const Property = require('../models/Property');

// @desc    Get all properties with advanced filters
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    let query = {};

    // Search by text
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filter by city, state
    if (req.query.city) query['address.city'] = new RegExp(req.query.city, 'i');
    if (req.query.state) query['address.state'] = new RegExp(req.query.state, 'i');
    
    // Filter by property type and listing type
    if (req.query.propertyType) {
      const validTypes = ['apartment', 'villa', 'house', 'land', 'commercial'];
      if (validTypes.includes(req.query.propertyType)) {
        query.propertyType = req.query.propertyType;
      }
    }
    if (req.query.listingType) {
      const validListingTypes = ['sale', 'rent'];
      if (validListingTypes.includes(req.query.listingType)) {
        query.listingType = req.query.listingType;
      }
    }
    if (req.query.status) {
      const validStatuses = ['available', 'sold', 'rented', 'pending'];
      if (validStatuses.includes(req.query.status)) {
        query.status = req.query.status;
      }
    }

    // Price range with validation
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) {
        const minPrice = Number(req.query.minPrice);
        if (!isNaN(minPrice) && minPrice >= 0) {
          query.price.$gte = minPrice;
        }
      }
      if (req.query.maxPrice) {
        const maxPrice = Number(req.query.maxPrice);
        if (!isNaN(maxPrice) && maxPrice >= 0) {
          query.price.$lte = maxPrice;
        }
      }
    }

    // Bedrooms and bathrooms with validation
    if (req.query.bedrooms) {
      const bedrooms = Number(req.query.bedrooms);
      if (!isNaN(bedrooms) && bedrooms > 0) {
        query.bedrooms = { $gte: bedrooms };
      }
    }
    if (req.query.bathrooms) {
      const bathrooms = Number(req.query.bathrooms);
      if (!isNaN(bathrooms) && bathrooms > 0) {
        query.bathrooms = { $gte: bathrooms };
      }
    }

    // Area range with validation
    if (req.query.minArea || req.query.maxArea) {
      query.area = {};
      if (req.query.minArea) {
        const minArea = Number(req.query.minArea);
        if (!isNaN(minArea) && minArea >= 0) {
          query.area.$gte = minArea;
        }
      }
      if (req.query.maxArea) {
        const maxArea = Number(req.query.maxArea);
        if (!isNaN(maxArea) && maxArea >= 0) {
          query.area.$lte = maxArea;
        }
      }
    }

    // Featured properties
    if (req.query.featured === 'true' || req.query.featured === 'false') {
      query.featured = req.query.featured === 'true';
    }

    // Amenities filter
    if (req.query.amenities) {
      const amenitiesArray = req.query.amenities.split(',').filter(a => a.trim());
      if (amenitiesArray.length > 0) {
      query.amenities = { $all: amenitiesArray };
      }
    }

    // Sort with validation
    let sortBy = '-createdAt';
    const validSorts = {
      'price_asc': 'price',
      'price_desc': '-price',
      'rating': '-ratings.average',
      'views': '-views',
      'newest': '-createdAt',
      'oldest': 'createdAt'
    };
    if (req.query.sort && validSorts[req.query.sort]) {
      sortBy = validSorts[req.query.sort];
    }

    // Pagination with validation
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const startIndex = (page - 1) * limit;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone')
      .sort(sortBy)
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: properties,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Server error while fetching properties' 
    });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid property ID format' 
      });
    }

    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone avatar');

    if (!property) {
      return res.status(404).json({ 
        success: false, 
        error: 'Property not found' 
      });
    }

    // Increment views
    property.views += 1;
    await property.save();

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Server error while fetching property' 
    });
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private (Agent/Admin)
exports.createProperty = async (req, res) => {
  try {
    req.body.owner = req.user.id;
    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      data: property,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner/Admin)
exports.updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authorized to update this property' 
      });
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: property,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner/Admin)
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ 
        success: false, 
        error: 'Not authorized to delete this property' 
      });
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
exports.getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.find({ featured: true, status: 'available' })
      .populate('owner', 'name email phone')
      .limit(6)
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get similar properties
// @route   GET /api/properties/:id/similar
// @access  Public
exports.getSimilarProperties = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    const priceRange = property.price * 0.2; // 20% range

    const similarProperties = await Property.find({
      _id: { $ne: property._id },
      propertyType: property.propertyType,
      'address.city': property.address.city,
      price: {
        $gte: property.price - priceRange,
        $lte: property.price + priceRange,
      },
      status: 'available',
    })
      .limit(4)
      .populate('owner', 'name email phone');

    res.status(200).json({
      success: true,
      count: similarProperties.length,
      data: similarProperties,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get properties with virtual tours
// @route   GET /api/properties/with-tours
// @access  Public
exports.getPropertiesWithTours = async (req, res) => {
  try {
    const properties = await Property.find({
      'panoramicImages.0': { $exists: true },
      'panoramicImages': { $ne: [] },
      status: 'available'
    })
      .populate('owner', 'name email phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    console.error('Error fetching properties with tours:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Server error while fetching properties with tours' 
    });
  }
};

// @desc    Get property statistics
// @route   GET /api/properties/stats
// @access  Private/Admin
exports.getPropertyStats = async (req, res) => {
  try {
    const stats = await Property.aggregate([
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
    ]);

    const totalProperties = await Property.countDocuments();
    const availableProperties = await Property.countDocuments({ status: 'available' });
    const soldProperties = await Property.countDocuments({ status: 'sold' });

    res.status(200).json({
      success: true,
      data: {
        byType: stats,
        total: totalProperties,
        available: availableProperties,
        sold: soldProperties,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
