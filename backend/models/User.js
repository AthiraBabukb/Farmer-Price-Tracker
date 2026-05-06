// Import mongoose to create schema
const mongoose = require('mongoose');

// Import bcryptjs to encrypt passwords
const bcrypt = require('bcryptjs');

// Define what a User looks like in database
const userSchema = new mongoose.Schema(
  {
    // Farmer's full name
    name: {
      type: String,       // text field
      required: true,     // cannot be empty
      trim: true          // removes extra spaces
    },

    // Farmer's email
    email: {
      type: String,
      required: true,
      unique: true,       // no duplicate emails
      trim: true,
      lowercase: true     // always saves as lowercase
    },

    // Farmer's password
    password: {
      type: String,
      required: true,
      minlength: 6        // minimum 6 characters
    },

    // Farmer's phone number
    phone: {
      type: String,
      required: true,
      trim: true
    },

    // Farmer's district
    district: {
      type: String,
      required: true,
      trim: true
    },

    // Crops farmer is interested in
    preferredCrops: {
      type: [String],     // array of strings
      default: []         // empty by default
    }
  },
  {
    timestamps: true      // adds createdAt, updatedAt
  }
);

// Auto encrypt password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to check password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create model
const User = mongoose.model('User', userSchema);

module.exports = User;