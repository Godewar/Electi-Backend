const User = require("../models/User");

const me = async (req, res) => {
  return res.json({ user: req.user });
};

const updateMe = async (req, res) => {
  try {
    const allowedFields = ["fullName", "phone", "bio"];
    const updates = {};

    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = String(req.body[key] || "").trim();
      }
    }

    const updated = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select("-passwordHash");

    return res.json({ message: "Profile updated", user: updated });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update profile" });
  }
};

module.exports = { me, updateMe };
