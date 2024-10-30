import mongoose from "mongoose";

const bookSchema = mongoose.Schema({

  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true
  },
  coverPage: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: false,
    default: "No bio available"
  },
  location: {
    type: String,
    default: "Aisle 3, Shelf B"
  },
  publicationDate: {
    type: Date,
    required: true
  },
  available: {
    type: Boolean,
    default: true
  },
},{timestamps: true});
bookSchema.index({ title: 1, author: 1 }, { unique: true });

const Book = mongoose.model("Book",bookSchema)

export default Book