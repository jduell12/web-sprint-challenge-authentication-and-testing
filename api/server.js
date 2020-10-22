const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
// const session = require("express-session");

const authenticate = require("../auth/authenticate-middleware.js");
const authRouter = require("../auth/auth-router.js");
const jokesRouter = require("../jokes/jokes-router.js");
// const sessionConfig = require("./sessionConfig");

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
// server.use(session(sessionConfig));

server.use("/api/auth", authRouter);
server.use("/api/jokes", authenticate, jokesRouter);

server.get("/", (req, res) => {
  res.status(200).json({ server: "working" });
});

module.exports = server;
