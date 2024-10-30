import Book from "../models/bookModel.js";
import mongoose from "mongoose"

//Get Books
const getBooks = async (req, res) => {
  try {
    if (!req.user.isAdmin)
        return res.status(400).json({ error: "You are not allowed" });
    
      const books = await Book.find()
      res.status(200).json(books);
  } catch (error) {
    console.log("Error in getBooks:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

//Get Book
const getBook = async (req, res) => {
  try {
    if (!req.user.isAdmin)
        return res.status(400).json({ error: "You are not allowed" });

    const bookId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
        return res.status(400).json({ error: `Invalid book ID` });
      }

      const book = await Book.findById(bookId)
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

export { createBook, updateBook,deleteBook, getBooks, getBook };
// //Logout User
// const getUsers = async (req, res) => {
//   try {
//   } catch (error) {
//     console.log("Error in getUsers:", error.message);
//     return res.status(500).json({ error: error.message });
//   }
// };
