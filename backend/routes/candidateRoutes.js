const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const { protect } = require("../middleware/authMiddleware");

// @route   POST /api/candidates
// @desc    Add a new candidate
// @access  Private
router.post("/", protect, async (req, res) => {
  const { name, email, skills, experience, bio } = req.body;

  try {
    const existingCandidate = await Candidate.findOne({ email });
    if (existingCandidate) {
      return res.status(400).json({ message: "Candidate with this email already exists" });
    }

    const candidate = await Candidate.create({
      name,
      email,
      skills,
      experience,
      bio,
    });

    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/candidates
// @desc    Get all candidates
// @access  Private
router.get("/", protect, async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/candidates/:id
// @desc    Get single candidate by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/candidates/:id
// @desc    Update a candidate
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const updated = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/candidates/:id
// @desc    Delete a candidate
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    await candidate.deleteOne();
    res.json({ message: "Candidate removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;