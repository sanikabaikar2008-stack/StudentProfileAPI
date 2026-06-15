const express = require("express");

const Profile = require("../models/Profile");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ============================
// CREATE PROFILE
// ============================
router.post("/profile", authMiddleware, async (req, res) => {
  try {

    const existingProfile = await Profile.findOne({ userId: req.user.id });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists"
      });
    }

    const profile = await Profile.create({
      userId: req.user.id,
      name: req.body.name,
      rollNumber: req.body.rollNumber,
      class: req.body.class,
      department: req.body.department,
      teacher: req.body.teacher,
      phoneNumber: req.body.phoneNumber
    });

    res.status(201).json({
      success: true,
      data: profile
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ============================
// GET PROFILE
// ============================
router.get("/profile", authMiddleware, async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        email: user.email,
        name: profile.name,
        rollNumber: profile.rollNumber,
        class: profile.class,
        department: profile.department,
        teacher: profile.teacher,
        phoneNumber: profile.phoneNumber
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ============================
// UPDATE PROFILE
// ============================
router.put("/profile", authMiddleware, async (req, res) => {
  try {

    const allowedUpdates = {
      name: req.body.name,
      rollNumber: req.body.rollNumber,
      class: req.body.class,
      department: req.body.department,
      teacher: req.body.teacher,
      phoneNumber: req.body.phoneNumber
    };

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found to update"
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ============================
// DELETE PROFILE
// ============================
router.delete("/profile", authMiddleware, async (req, res) => {
  try {

    const profile = await Profile.findOneAndDelete({
      userId: req.user.id
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile already deleted or not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;