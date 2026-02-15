const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a school name'],
      trim: true,
      maxlength: [100, 'School name cannot be more than 100 characters'],
      unique: true
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
      trim: true,
      maxlength: [200, 'Address cannot be more than 200 characters']
    },
    contactEmail: {
      type: String,
      required: [true, 'Please provide a contact email'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('School', schoolSchema);
