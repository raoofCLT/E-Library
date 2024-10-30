import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateToken from "../genToken/generateToken.js";

//Get Users
const getUsers = async (req, res) => {
  try {
    const currentUser = req.user
    if (!currentUser.isAdmin) {
      return res.status(400).json({ message: "Your are not an admit" });
    }

    const users = await User.find({_id:{$ne: currentUser._id}}).select("-password -updatedAt");
    res.status(200).json(users);
  } catch (error) {
    console.log("Error in getUsers:", error.message);
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
      token,
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

export { signupUser, loginUser, logoutUser, getUsers };

