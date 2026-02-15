const mongoose = require('mongoose');

const classroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a classroom name'],
      trim: true,
      maxlength: [50, 'Classroom name cannot be more than 50 characters']
    },
    capacity: {
      type: Number,
      required: [true, 'Please provide classroom capacity'],
      min: [1, 'Capacity must be at least 1'],
      max: [500, 'Capacity cannot exceed 500']
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

classroomSchema.index({ name: 1, school: 1 }, { unique: true });

module.exports = mongoose.model('Classroom', classroomSchema);
