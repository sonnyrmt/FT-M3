// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let id = 0;
let posts = [];

const server = express();
server.use(express.json());
// to enable parsing of json bodies for post requests
// server.use(express.json());

// TODO: your code to handle requests
const authBody = (req, res, from) => {
  if (req.body) {
    const { author, title, contents } = req.body;

    if (from === "author") {
      if (!title || !contents)
        return res.status(STATUS_USER_ERROR).json({ error: req.body });
    } else {
      if (!author || !title || !contents) {
        res.status(STATUS_USER_ERROR).json({ error: req.body });
      }
    }
  } else {
    res
      .status(STATUS_USER_ERROR)
      .json({ error: "No se recibieron los parametros" });
  }
};

server.post("/posts", (req, res) => {
  authBody(req, res);

  const { author, title, contents } = req.body;

  const post = {
    author: author,
    title: title,
    contents: contents,
    id: id++,
  };

  posts.push(post);
  res.json(post);
});

server.post("/posts/author/:author", (req, res) => {
  authBody(req, res, "author");
  const { title, contents } = req.body;

  const post = {
    author: req.params.author,
    title: title,
    contents: contents,
    id: id++,
  };

  posts.push(post);
  res.json(post);
});

server.get("/posts", (req, res) => {
  const { term } = req.query;
  if (term) {
    let filtered = posts.filter(
      (post) => post.title.includes(term) || post.contents.includes(term)
    );
    res.json(filtered);
  } else {
    res.json(posts);
  }
});

server.get("/posts/:author", (req, res) => {
  const { author } = req.params;
  const filtered = posts.filter((post) => post.author == author);
  if (filtered.length) {
    res.json(filtered);
  } else {
    res.status(STATUS_USER_ERROR).json({ error: STATUS_USER_ERROR });
  }
});

server.get("/posts/:author/:title", (req, res) => {
  const { author, title } = req.params;
  const filtered = posts.filter(
    (p) => p.author === author && p.title === title
  );

  if (filtered.length) {
    res.status(200).json(filtered);
  } else {
    res
      .status(STATUS_USER_ERROR)
      .json({
        error: "No existe ningun post con dicho titulo y autor indicado",
      });
  }
});

server.put("/posts", (req, res) => {
  const { id, title, contents } = req.body;
  if (id && title && contents) {
    const matchId = posts.find((p) => p.id === parseInt(id));
    if (matchId) {
      matchId.title = title;
      matchId.contents = contents;
      res.send(matchId);
    } else {
      res
        .status(STATUS_USER_ERROR)
        .json({
          error: "No se recibio el id necesario para modificar el Post",
        });
    }
  } else {
    res
      .status(STATUS_USER_ERROR)
      .json({
        error:
          "No se recibieron los parámetros necesarios para modificar el Post",
      });
  }
});

server.delete("/posts", (req, res) => {
  const { id } = req.body;
  const matchId = posts.find((p) => p.id === parseInt(id));
  if (id) {
    if (matchId) {
      posts = posts.filter((p) => p.id !== id);
      res.status(200).json({ success: true });
    } else {
      res
        .status(STATUS_USER_ERROR)
        .json({ error: "No se encontro el id en memoria para borrar el Post" });
    }
  } else {
    res.status(STATUS_USER_ERROR).json({ error: "No se recibio el id" });
  }
});

server.delete("/author", (req, res) => {
  const { author } = req.body;
  if(author) {
    const matchAuthor = posts.filter( p => p.author === author);
    if(matchAuthor.length) {
      posts = posts.filter( p => p.author !== author);
      res.status(200).json(matchAuthor)
    } else {
      res
      .status(STATUS_USER_ERROR)
      .json({ error: "No existe el autor indicado" });
    }
  } else {
    res.status(STATUS_USER_ERROR).json({ error: "No se recibio el author" });
  }
});

module.exports = { posts, server };
