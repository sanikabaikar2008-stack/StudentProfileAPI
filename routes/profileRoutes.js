const express = require("express");

const Profile = require("../models/Profile");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE PROFILE (Protected)
router.post(
  "/profile",
  authMiddleware,
  async (req, res) => {

    try {

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

  }
);


// GET PROFILE (Protected)
router.get(
  "/profile",
  authMiddleware,
  async (req, res) => {

    try {

      const user = await User.findById(req.user.id);

      const profile = await Profile.findOne({
        userId: req.user.id
      });

      if (!profile) {

        return res.status(404).json({
          success: false,
          message: "Profile not found"
        });

      }

      res.status(200).json({
        id: user._id,
        email: user.email,
        name: profile.name,
        rollNumber: profile.rollNumber
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }
);

router.put(
  "/profile",
  authMiddleware,
  async (req, res) => {

    try {

      const profile = await Profile.findOneAndUpdate(
        { userId: req.user.id },
        req.body,
        { new: true }
      );

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

  }
);

router.delete(
  "/profile",
  authMiddleware,
  async (req, res) => {

    try {

      await Profile.findOneAndDelete({
        userId: req.user.id
      });

      res.status(200).json({
        success: true,
        message: "Profile Deleted Successfully"
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message
      });

    }

  }
);

module.exports = router;