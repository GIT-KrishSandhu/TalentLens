const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const { protect } = require("../middleware/authMiddleware");
const axios = require("axios");

// @route   POST /api/ai/shortlist
// @desc    AI-powered candidate ranking via OpenRouter
// @access  Private
router.post("/shortlist", protect, async (req, res) => {
  const { requiredSkills, preferredSkills = [], minExperience = 0 } = req.body;

  if (!requiredSkills || requiredSkills.length === 0) {
    return res.status(400).json({ message: "requiredSkills cannot be empty" });
  }

  try {
    // Fetch all candidates from DB
    const candidates = await Candidate.find();

    if (candidates.length === 0) {
      return res.status(404).json({ message: "No candidates found in database" });
    }

    // Build candidate list string for the prompt
    const candidateList = candidates
      .map(
        (c, i) =>
          `${i + 1}. Name: ${c.name} | Skills: ${c.skills.join(", ")} | Experience: ${c.experience} years | Bio: ${c.bio || "N/A"}`
      )
      .join("\n");

    // Build the prompt
    const prompt = `
You are an expert technical recruiter AI. Your job is to rank candidates for a job opening.

Job Requirements:
- Required Skills: ${requiredSkills.join(", ")}
- Preferred Skills: ${preferredSkills.length > 0 ? preferredSkills.join(", ") : "None"}
- Minimum Experience: ${minExperience} years

Candidates:
${candidateList}

Instructions:
- Rank ALL candidates from best fit to worst fit
- For each candidate give a match score out of 100
- Give a rank label: High, Medium, or Low
- Write a short 1-2 sentence explanation of why they are or aren't a good fit
- Respond ONLY with a valid JSON array, no extra text, no markdown, no backticks

Response format (strict JSON array):
[
  {
    "name": "Candidate Name",
    "matchScore": 85,
    "rank": "High",
    "reason": "Strong match because..."
  }
]
`;

    // Call OpenRouter API
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "Candidate Shortlisting System",
        },
      }
    );

    // Parse AI response
    const rawText = response.data.choices[0].message.content.trim();

    let aiRankings;
    try {
      aiRankings = JSON.parse(rawText);
    } catch (parseError) {
      return res.status(500).json({
        message: "AI returned invalid JSON. Try again.",
        raw: rawText,
      });
    }

    // Merge AI rankings with full candidate data from DB
    const enriched = aiRankings.map((aiResult) => {
      const fullCandidate = candidates.find(
        (c) => c.name.toLowerCase() === aiResult.name.toLowerCase()
      );
      return {
        ...aiResult,
        email: fullCandidate?.email || "N/A",
        skills: fullCandidate?.skills || [],
        experience: fullCandidate?.experience || 0,
        bio: fullCandidate?.bio || "",
      };
    });

    res.json({
      jobRequirements: {
        requiredSkills,
        preferredSkills,
        minExperience,
      },
      totalCandidates: candidates.length,
      aiRankings: enriched,
    });
  } catch (error) {
    if (error.response) {
      return res.status(500).json({
        message: "OpenRouter API error",
        detail: error.response.data,
      });
    }
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;