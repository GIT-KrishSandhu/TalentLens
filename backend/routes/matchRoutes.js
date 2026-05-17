const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const { protect } = require("../middleware/authMiddleware");

// Helper: calculate match score and details
const calculateMatch = (candidate, requiredSkills, preferredSkills = [], minExperience = 0) => {
  const candidateSkills = candidate.skills.map((s) => s.toLowerCase());
  const required = requiredSkills.map((s) => s.toLowerCase());
  const preferred = preferredSkills.map((s) => s.toLowerCase());

  // Required skill matching
  const matchedRequired = required.filter((skill) =>
    candidateSkills.includes(skill)
  );
  const requiredScore =
    required.length > 0 ? matchedRequired.length / required.length : 1;

  // Preferred skill matching
  const matchedPreferred = preferred.filter((skill) =>
    candidateSkills.includes(skill)
  );
  const preferredScore =
    preferred.length > 0 ? matchedPreferred.length / preferred.length : 0;

  // Final weighted score (required = 70%, preferred = 30%)
  const finalScore = preferred.length > 0
    ? requiredScore * 0.7 + preferredScore * 0.3
    : requiredScore;

  // Experience check
  const meetsExperience = candidate.experience >= minExperience;

  // Rank label
  let rank;
  if (finalScore >= 0.75 && meetsExperience) rank = "High";
  else if (finalScore >= 0.4) rank = "Medium";
  else rank = "Low";

  return {
    _id: candidate._id,
    name: candidate.name,
    email: candidate.email,
    skills: candidate.skills,
    experience: candidate.experience,
    bio: candidate.bio,
    matchedRequired,
    matchedPreferred,
    matchScore: Math.round(finalScore * 100),
    meetsExperience,
    rank,
  };
};

// @route   POST /api/match
// @desc    Shortlist candidates based on skills + experience
// @access  Private
router.post("/", protect, async (req, res) => {
  const { requiredSkills, preferredSkills, minExperience } = req.body;

  if (!requiredSkills || requiredSkills.length === 0) {
    return res.status(400).json({ message: "requiredSkills cannot be empty" });
  }

  try {
    const candidates = await Candidate.find();

    const results = candidates
      .map((candidate) =>
        calculateMatch(candidate, requiredSkills, preferredSkills, minExperience)
      )
      .sort((a, b) => b.matchScore - a.matchScore);

    // Separate into tiers
    const high = results.filter((c) => c.rank === "High");
    const medium = results.filter((c) => c.rank === "Medium");
    const low = results.filter((c) => c.rank === "Low");

    res.json({
      totalCandidates: candidates.length,
      matched: results.length,
      tiers: { high, medium, low },
      all: results,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;