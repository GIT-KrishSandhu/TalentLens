const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Candidate name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  skills: {
    type: [String],
    required: [true, "At least one skill is required"],
  },
  experience: {
    type: Number,
    required: [true, "Experience in years is required"],
    min: 0,
  },
  bio: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Candidate", CandidateSchema);