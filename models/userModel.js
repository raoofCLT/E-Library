import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    profilePic: {
      type: String,
      default:""
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    currentBooks: {
      type: [String],
      default: []
    },
    books: {
      type: [String],
      default: []
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User",userSchema)

export default User