import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateToken from "../genToken/generateToken.js";
import mongoose from "mongoose";

//Get Users
const getUsers = async (req, res) => {
  try {
    const currentUser = req.user;
    if (!currentUser.isAdmin) {
      return res.status(400).json({ message: "Your are not an admit" });
    }

    const users = await User.find({ _id: { $ne: currentUser._id } }).select(
      "-password -updatedAt"
    );
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUsers:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

//Search User
const searchUser = async (req, res) => {
  try {
    const searchUser = req.params.username;
    const currentUser = req.user;
    if (!currentUser.isAdmin) {
      return res.status(400).json({ message: "Your are not an admit" });
    }

    const user = await User.find({
      username: { $regex: new RegExp(searchUser, "i") },
    });

    if (!user || user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in searchUser:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

//Get User
const getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: `Invalid user ID` });
    }

    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUser:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

//Signup User
const signupUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (user) return res.status(400).json({ error: "User already exists" });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = generateToken(newUser._id, res);

    return res.status(201).json({
      message: "User registered successfully",
      _id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error in signupUser:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

//Login User
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user)
      return res
        .status(404)
        .json({ error: "User not found, Please create an account" });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res
        .status(400)
        .json({ error: "Incorrect password, Please check your password" });

    const token = generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      token,
    });
  } catch (error) {
    console.log("Error in loginUser:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

//Logout User
const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("Error in loginUser:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

//Update User
const updateUser = async (req, res) => {
  const { name, username, email, password, profilePic } = req.body;

  const userId = req.user._id;
  try {
    const dbUser = await User.findById(userId);
    if (!dbUser) return res.status(404).json({ error: "User not found" });

    if (req.params.id !== userId.toString())
      return res
        .status(400)
        .json({ error: "You cannot update other user's profile  " });

    if (password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      dbUser.password = hashedPassword;
    }

    dbUser.name = name || dbUser.name;
    dbUser.email = email || dbUser.email;
    dbUser.username = username || dbUser.username;
    dbUser.profilePic = profilePic || dbUser.profilePic;

    const user = await dbUser.save();

    user.password = null;
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in updateUser:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(400).json({ error: "You are not allowed" });

    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: `Invalid User ID` });
    }

    const dbUser = await User.findByIdAndDelete(userId);
    if (!dbUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Removed user successfully" });
  } catch (error) {
    console.log("Error in deleteUser:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export {
  signupUser,
  loginUser,
  logoutUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  searchUser,
};
