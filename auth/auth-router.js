const router = require("express").Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Users = require("../users/usersModel");
const { isValid, loginValid } = require("../users/usersService");
const constants = require("../config/constants");

router.post("/register", (req, res) => {
  const user = req.body;

  if (isValid(user)) {
    const rounds = process.env.BCRYPT_ROUNDS || 12;

    //hash password
    const hash = bcryptjs.hashSync(user.password, rounds);
    user.password = hash;

    //add user to the database
    Users.addUser(user)
      .then((user) => {
        res.status(201).json({ data: user });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } else {
    res.status(400).json({ message: "please provide a username and password" });
  }
});

router.post("/login", (req, res) => {
  // implement login
});

module.exports = router;
