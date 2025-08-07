require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const upload = require("./multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { sendVerificationEmail, sendPasswordResetEmail } = require("./services/emailService");

const { authenticateToken } = require("./utilities");

const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");

mongoose.connect(config.connectionString)
  .then(() => {
    console.log('✅ Database connected successfully');
  })
  .catch((error) => {
    console.log('❌ Database connection failed:', error.message);
    process.exit(1);
  });

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  const isUser = await User.findOne({ email });
  if (isUser) {
    return res
      .status(400)
      .json({ error: true, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');

  const user = new User({
    fullName,
    email,
    password: hashedPassword,
    emailVerificationToken,
    isEmailVerified: false,
  });

  await user.save();

  try {
    await sendVerificationEmail(email, emailVerificationToken, fullName);
    return res.status(201).json({
      error: false,
      message: "Registration successful! Please check your email to verify your account.",
    });
  } catch (emailError) {
    console.log("Email sending failed:", emailError.message);
    return res.status(201).json({
      error: false,
      message: "Registration successful! However, verification email could not be sent. Please contact support.",
      verificationToken: emailVerificationToken,
    });
  }
});

// Forgot Password
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: true, message: "User not found" });
  }

  // Clear any existing reset tokens to ensure only one active token per user
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  const resetToken = crypto.randomBytes(32).toString('hex');
  const expirationTime = Date.now() + 3600000; // 1 hour
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = expirationTime;
  await user.save();
  
  console.log("Reset token generated:", resetToken.substring(0, 8) + "...");
  console.log("Full token:", resetToken);
  console.log("Token length:", resetToken.length);
  console.log("Token expires at:", new Date(expirationTime));

  try {
    await sendPasswordResetEmail(email, resetToken, user.fullName);
    return res.json({
      error: false,
      message: "Password reset link sent to your email!",
    });
  } catch (emailError) {
    console.log("Email sending failed:", emailError.message);
    return res.json({
      error: false,
      message: "Password reset link generated but email could not be sent. Please contact support.",
      resetToken: resetToken,
    });
  }
});

// Reset Password
app.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  console.log("Reset password request received:", {
    token: token ? token.substring(0, 8) + "..." : "null",
    password: password ? "present" : "missing"
  });

  if (!token || !password) {
    return res.status(400).json({ error: true, message: "Token and password are required" });
  }

  try {
    // Trim whitespace and handle potential URL encoding
    let cleanToken = token.trim();
    
    // Try decoding if it looks like it might be URL encoded
    try {
      const decodedToken = decodeURIComponent(cleanToken);
      if (decodedToken !== cleanToken) {
        console.log("Token appears to be URL encoded, using decoded version");
        cleanToken = decodedToken;
      }
    } catch (e) {
      // If decoding fails, use original token
      console.log("Token decoding failed, using original");
    }
    
    console.log("Looking for user with token:", cleanToken.substring(0, 8) + "...");
    
    const user = await User.findOne({ resetPasswordToken: cleanToken });
    
    if (!user) {
      console.log("No user found with provided token");
      // Let's also search for any users with reset tokens for debugging
      const usersWithTokens = await User.find({ resetPasswordToken: { $exists: true, $ne: null } });
      console.log("Users with reset tokens:", usersWithTokens.length);
      if (usersWithTokens.length > 0) {
        console.log("First user token starts with:", usersWithTokens[0].resetPasswordToken.substring(0, 8) + "...");
        console.log("Token expires at:", new Date(usersWithTokens[0].resetPasswordExpires));
      }
      return res.status(400).json({ 
        error: true, 
        message: "Invalid or expired reset token. Please request a new password reset link." 
      });
    }

    console.log("User found, checking token expiry");
    console.log("Token expires at:", new Date(user.resetPasswordExpires));
    console.log("Current time:", new Date());

    if (user.resetPasswordExpires < Date.now()) {
      console.log("Token has expired");
      // Clear the expired token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      return res.status(400).json({ 
        error: true, 
        message: "Reset token has expired. Please request a new password reset link." 
      });
    }

    console.log("Token is valid, updating password");
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({
      error: false,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: "Server error" });
  }
});

// Verify Email
app.post("/verify-email", async (req, res) => {
  const { token } = req.body;
  console.log("Verify email request received with token:", token);

  if (!token) {
    console.log("No token provided");
    return res.status(400).json({ error: true, message: "Verification token is required" });
  }

  try {
    const user = await User.findOne({ emailVerificationToken: token });
    console.log("User found:", user ? "Yes" : "No");
    
    if (!user) {
      return res.status(400).json({ error: true, message: "Invalid or expired verification token" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    console.log("Email verified successfully for user:", user.email);

    return res.json({
      error: false,
      message: "Email verified successfully! You can now login.",
    });
  } catch (error) {
    console.log("Verification error:", error);
    return res.status(500).json({ error: true, message: "Server error during verification" });
  }
});

// Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "72h",
    }
  );

  return res.json({
    error: false,
    message: "Login Successful",
    user: { fullName: user.fullName, email: user.email },
    accessToken,
  });
});

// Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const { userId } = req.user;

  const isUser = await User.findOne({ _id: userId });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: isUser,
    message: "",
  });
});

// Route to handle image upload
app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: true, message: "No image uploaded" });
    }

    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;

    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Delete an image from uploads folder
app.delete("/delete-image", async (req, res) => {
  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res
      .status(400)
      .json({ error: true, message: "imageUrl parameter is required" });
  }

  try {
    // Extract the filename from the imageUrl
    const filename = path.basename(imageUrl);

    // Define the file path
    const filePath = path.join(__dirname, "uploads", filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Delete the file from the uploads folder
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Image deleted successfully" });
    } else {
      res.status(200).json({ error: true, message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Serve static files from the uploads and assets directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Add Travel Story
app.post("/add-travel-story", authenticateToken, async (req, res) => {
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  // Validate required fields
  if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  // Convert visitedDate from milliseconds to Date object
  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    const travelStory = new TravelStory({
      title,
      story,
      visitedLocation,
      userId,
      imageUrl,
      visitedDate: parsedVisitedDate,
    });

    await travelStory.save();
    res.status(201).json({ story: travelStory, message: "Added Successfully" });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
});

// Get All Travel Stories
app.get("/get-all-stories", authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const travelStories = await TravelStory.find({ userId: userId }).sort({
      isFavourite: -1,
    });
    res.status(200).json({ stories: travelStories });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Edit Travel Story
app.put("/edit-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
  const { userId } = req.user;

  // Validate required fields
  if (!title || !story || !visitedLocation || !visitedDate) {
    return res
      .status(400)
      .json({ error: true, message: "All fields are required" });
  }

  // Convert visitedDate from milliseconds to Date object
  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    // Find the travel story by ID and ensure it belongs to the authenticated user
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return res
        .status(404)
        .json({ error: true, message: "Travel story not found" });
    }

    const placeholderImgUrl = `http://localhost:8000/assets/placeholder.png`;

    travelStory.title = title;
    travelStory.story = story;
    travelStory.visitedLocation = visitedLocation;
    travelStory.imageUrl = imageUrl || placeholderImgUrl;
    travelStory.visitedDate = parsedVisitedDate;

    await travelStory.save();
    res.status(200).json({ story: travelStory, message: "Update Successful" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Delete a travel story
app.delete("/delete-story/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { userId } = req.user;

  try {
    // Find the travel story by ID and ensure it belongs to the authenticated user
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return res
        .status(404)
        .json({ error: true, message: "Travel story not found" });
    }

    // Delete the travel story from the database
    await travelStory.deleteOne({ _id: id, userId: userId });

    // Extract the filename from the imageUrl
    const imageUrl = travelStory.imageUrl;
    const filename = path.basename(imageUrl);

    // Define the file path
    const filePath = path.join(__dirname, "uploads", filename);

    // Delete the image file from the uploads folder
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete image file:", err);
        // Optionally, you could still respond with a success status here
        // if you don't want to treat this as a critical error.
      }
    });

    res.status(200).json({ message: "Travel story deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Update isFavourite
app.put("/update-is-favourite/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { isFavourite } = req.body;
  const { userId } = req.user;

  try {
    const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

    if (!travelStory) {
      return res
        .status(404)
        .json({ error: true, message: "Travel story not found" });
    }

    travelStory.isFavourite = isFavourite;

    await travelStory.save();
    res.status(200).json({ story: travelStory, message: "Update Successful" });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Search travel stories
app.get("/search", authenticateToken, async (req, res) => {
  const { query } = req.query;
  const { userId } = req.user;

  if (!query) {
    return res.status(404).json({ error: true, message: "query is required" });
  }

  try {
    const searchResults = await TravelStory.find({
      userId: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { visitedLocation: { $regex: query, $options: "i" } },
      ],
    }).sort({ isFavourite: -1 });

    res.status(200).json({ stories: searchResults });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// Filter travel stories by date range
app.get("/travel-stories/filter", authenticateToken, async (req, res) => {
  const { startDate, endDate } = req.query;
  const { userId } = req.user;

  try {
    // Convert startDate and endDate from milliseconds to Date objects
    const start = new Date(parseInt(startDate));
    const end = new Date(parseInt(endDate));

    // Find travel stories that belong to the authenticated user and fall within the date range
    const filteredStories = await TravelStory.find({
      userId: userId,
      visitedDate: { $gte: start, $lte: end },
    }).sort({ isFavourite: -1 });

    res.status(200).json({stories: filteredStories});
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log('🚀 Backend server is running on port', PORT);
  console.log('📡 Server URL: http://localhost:' + PORT);
});
module.exports = app;
