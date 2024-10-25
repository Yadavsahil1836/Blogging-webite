const { Schema, model } = require('mongoose');

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  coverImageUrl: {
    type: String,
    required: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

// Create the Blog model
const BLOG = model('Blog', blogSchema);

// Export the BLOG model
module.exports = BLOG;
