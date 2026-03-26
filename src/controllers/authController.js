const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { signToken } = require("../utils/jwt");

const sanitizeUser = (user) => ({
  id: user._id,
  fullName: user.fullName,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  bio: user.bio,
  category: user.category,
  designation: user.designation,
  profilePicture: user.profilePicture,
  instagram: user.instagram,
  facebook: user.facebook,
  snapchat: user.snapchat,
  linkedin: user.linkedin,
  area: user.area,
  website: user.website,
  businessName: user.businessName,
  createdAt: user.createdAt,
});

const register = async (req, res) => {
  try {
    const { 
      fullName = "", 
      firstName = "", 
      lastName = "", 
      email, 
      phone = "", 
      password 
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    
    // Auto-generate fullName if missing
    let finalFullName = String(fullName).trim();
    if (!finalFullName && (firstName || lastName)) {
      finalFullName = `${firstName} ${lastName}`.trim();
    }

    const user = await User.create({
      fullName: finalFullName,
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: normalizedEmail,
      phone: String(phone).trim(),
      passwordHash,
    });

    const token = signToken(user._id.toString());

    return res.status(201).json({
      message: "Registered successfully",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(String(password), user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user._id.toString());

    return res.json({
      message: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed" });
  }
};

module.exports = { register, login };
