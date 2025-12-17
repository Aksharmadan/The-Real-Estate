const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.ObjectId,
    ref: 'Property',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment'],
    maxlength: 500,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ReviewSchema.index({ property: 1, user: 1 }, { unique: true });

ReviewSchema.statics.getAverageRating = async function(propertyId) {
  const obj = await this.aggregate([
    { $match: { property: propertyId } },
    {
      $group: {
        _id: '$property',
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('Property').findByIdAndUpdate(propertyId, {
      'ratings.average': obj[0]?.averageRating || 0,
      'ratings.count': obj[0]?.count || 0
    });
  } catch (err) {
    console.error(err);
  }
};

ReviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.property);
});

module.exports = mongoose.model('Review', ReviewSchema);
