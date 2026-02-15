const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Please provide first name'],
      trim: true,
      maxlength: [50, 'First name cannot be more than 50 characters']
    },
    lastName: {
      type: String,
      required: [true, 'Please provide last name'],
      trim: true,
      maxlength: [50, 'Last name cannot be more than 50 characters']
    },
    age: {
      type: Number,
      required: [true, 'Please provide age'],
      min: [3, 'Age must be at least 3'],
      max: [100, 'Age cannot exceed 100']
    },
    classroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Classroom',
      required: [true, 'Please provide a classroom reference']
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: [true, 'Please provide a school reference']
    }
  },
  {
    timestamps: true
  }
);

studentSchema.index({ school: 1 });
studentSchema.index({ classroom: 1 });

module.exports = mongoose.model('Student', studentSchema);
