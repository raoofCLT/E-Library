import Book from "../models/bookModel.js";

// //Create Books
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
    console.log("Error in createBooks:", error.message);
  }
};

export { createBook };
