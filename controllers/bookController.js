import Book from "../models/bookModel.js";
import mongoose from "mongoose";
import User from "../models/userModel.js";

//Get Books
const getBooks = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(400).json({ error: "You are not allowed" });

    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.log("Error in getBooks:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

//Get Book
const getBook = async (req, res) => {
  try {
    // if (!req.user.isAdmin)
    //   return res.status(400).json({ error: "You are not allowed" });

    const bookId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: `Invalid book ID` });
    }

    const book = await Book.findById(bookId);
    res.status(200).json(book);
  } catch (error) {
    console.log("Error in getBook:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// Create Books
const createBook = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(400).json({ error: "You are not allowed" });

    const { title, coverPage, author, genre, publicationDate, bio } = req.body;
    if (!title || !coverPage || !author || !genre || !publicationDate)
      return res.status(400).json({ error: "Fill all required fields" });

    const newBook = new Book({
      title,
      coverPage,
      author,
      genre,
      publicationDate,
      bio,
    });
    await newBook.save();

    res.status(200).json(newBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("Error in createBook:", error.message);
  }
};

// Update Book
const updateBook = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(400).json({ error: "You are not allowed" });
    const { title, coverPage, author, genre, publicationDate, bio } = req.body;
    const bookId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: `Invalid book ID` });
    }

    const dbBook = await Book.findById(bookId);
    if (!dbBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    dbBook.title = title || dbBook.title;
    dbBook.coverPage = coverPage || dbBook.coverPage;
    dbBook.author = author || dbBook.author;
    dbBook.genre = genre || dbBook.genre;
    dbBook.publicationDate = publicationDate || dbBook.publicationDate;
    dbBook.bio = bio || dbBook.bio;

    const updateBook = await dbBook.save();

    res.status(200).json(updateBook);
  } catch (error) {
    console.log("Error in updateBook:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

// Delete Book
const deleteBook = async (req, res) => {
  try {
    if (!req.user.isAdmin)
      return res.status(400).json({ error: "You are not allowed" });

    const bookId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: `Invalid book ID` });
    }

    const dbBook = await Book.findByIdAndDelete(bookId);
    if (!dbBook) {
      return res.status(404).json({ error: "Book not found" });
    }
    return res.status(200).json({ message: "Book removed successfully" });
  } catch (error) {
    console.log("Error in deleteBook:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

//Check In
const checkIn = async (req, res) => {
  try {
    const bookId = req.params.id;
    const user = req.user;
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: `Invalid book ID` });
    }

    const dbBook = await Book.findById(bookId);
    if (!dbBook) return res.status(404).json({ error: "Book not found" });
    if (!dbBook.available)
      return res.status(400).json({ error: "Book is taken" });
    if (user.currentBooks.length === 5)
      return res.status(400).json({ error: "Max book limit reached" });

    await Book.findByIdAndUpdate(bookId, {
      $push: { readers: user._id },
      $set: { available: false },
    });

    await User.findByIdAndUpdate(user._id, {
      $push: { currentBooks: bookId },
      $addToSet: { books: bookId }
    });

    res.status(200).json({ message: "Book checked in successfully" });
  } catch (error) {
    console.log("Error in checkIn:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

//Check Out
const checkOut = async (req, res) => {
  try {
    const bookId = req.params.id;
    const user = req.user;
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ error: `Invalid book ID` });
    }

    const dbBook = await Book.findById(bookId);
    if (!dbBook) return res.status(404).json({ error: "Book not found" });

    const userExistsWithBookId = await User.findOne({
      _id: user._id,
      currentBooks: { $in: [bookId] },
    });

    if (!userExistsWithBookId) {
      return res
        .status(404)
        .json({ error: "You are not checked in this book" });
    }

    await Book.findByIdAndUpdate(bookId, { $set: { available: true } });

    await User.findByIdAndUpdate(user._id, { $pull: { currentBooks: bookId } });

    res.status(200).json({ message: "Book checked out successfully" });
  } catch (error) {
    console.log("Error in checkOut:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

//Suggested Books
const suggestedBooks = async (req, res) => {
  try {
    const userId = req.user;
    const userBooks = req.user.books;

    if (!userBooks.length) {
      const allBooks = await Book.find().limit(6);
      return res.status(200).json(allBooks);
    }

    const suggestedBooks = await Book.find({ _id: { $nin: userBooks } }).limit(
      6
    );
    res.status(200).json(suggestedBooks);
  } catch (error) {
    console.log("Error in suggestedBooks:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

//Trending Books
const trendingBooks = async (req, res) => {
  try {
    const sortedRandomBooks = await Book.aggregate([
      {
        $project: {
          title: 1,          
          coverPage: 1,    
          readersCount: { $size: "$readers" } 
        }
      },
      {
        $sort: { readersCount: -1 } 
      },
      {
        $limit: 5 
      }
    ]);

    res.status(200).json(sortedRandomBooks);
  } catch (error) {
    console.log("Error in trendingBooks:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export {
  createBook,
  updateBook,
  deleteBook,
  getBooks,
  getBook,
  checkIn,
  checkOut,
  suggestedBooks,
  trendingBooks,
};
// //Check In
// const checkIn = async (req, res) => {
//   try {
//   } catch (error) {
//     console.log("Error in checkIn:", error.message);
//     return res.status(500).json({ error: error.message });
//   }
// };
