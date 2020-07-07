"use strict";

const express = require("express");
const morgan = require("morgan");

const { top50 } = require("./data/top50");
const topArtist = require("./data/topartist");
const { books } = require("./data/books");

const PORT = process.env.PORT || 4000;

const app = express();

app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// endpoints here
app.get("/books", (req, res) => {
  res.status(200);
  res.render("pages/booklist", {
    title: "25 Books You Probably Should Have Read Already",
    books: books,
  });
});

app.get("/books/:id", (req, res) => {
  const bookID = Number(req.params.id);
  console.log(bookID);
  if (bookID > 100 && bookID < 126) {
    res.status(200);
    res.render("pages/uniquebook", {
      title: `Book #${bookID}`,
      bookID: bookID,
      bookTitle: books[bookID - 101].title,
      bookType: books[bookID - 101].type,
      bookImgUrl: books[bookID - 101].imgUrl,
      bookAuthor: books[bookID - 101].author,
      bookDescription: books[bookID - 101].description,
    });
    // } else if (bookID == NaN) {
    //   const bookType = req.params.id;
    //   console.log(bookType);
    //   const bookTypeArray = books.filter((element) => {
    //     return element.type === bookType;
    //   });
    //   if (bookTypeArray !== undefined) {
    //     console.log(bookTypeArray);
    //     res.status(200);
    //     res.render("pages/uniquebooktype", {
    //       title: `Type: ${bookType}`,
    //       bookTypeArray: bookTypeArray,
    //     });
    //   }
  } else {
    res.status(404);
    res.render("pages/fourOhFour", {
      title: "I got nothing",
      path: req.originalUrl,
    });
  }
});

app.get("/books/type/:type", (req, res) => {
  const bookType = req.params.type;
  console.log(bookType);
  const bookTypeArray = books.filter((element) => {
    return element.type === bookType;
  });
  if (bookTypeArray !== undefined) {
    console.log(bookTypeArray);
    res.status(200);
    res.render("pages/uniquebooktype", {
      title: `Type: ${bookType}`,
      bookTypeArray: bookTypeArray,
    });
  } else {
    res.status(404);
    res.render("pages/fourOhFour", {
      title: "I got nothing",
      path: req.originalUrl,
    });
  }
});

// handle 404s
app.get("/top50", (req, res) => {
  res.status(200);
  res.render("pages/top50", {
    title: "Top 50 Songs Streamed on Spotify",
    top50: top50,
  });
});

app.get("/top50/song/:number", (req, res) => {
  const songNumber = Number(req.params.number);

  if (songNumber > 0 && songNumber < 51) {
    res.status(200);
    res.render("pages/uniquesong", {
      title: `Song #${songNumber}`,
      songRank: songNumber,
      songStreams: top50[songNumber - 1].streams,
      songTitle: top50[songNumber - 1].title,
      songArtist: top50[songNumber - 1].artist,
      songDate: top50[songNumber - 1].publicationDate,
    });
  } else {
    res.status(404);
    res.render("pages/fourOhFour", {
      title: "I got nothing",
      path: req.originalUrl,
    });
  }
});

app.get("/popular-artist", (req, res) => {
  res.status(200);
  res.render("pages/popular-artist", {
    title: "Most Popular Artist",
    top50: top50,
    topArtist: topArtist,
  });
});

app.get("*", (req, res) => {
  res.status(404);
  res.render("pages/fourOhFour", {
    title: "I got nothing",
    path: req.originalUrl,
  });
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
