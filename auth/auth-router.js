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
  if (isValid(req.body)) {
    const { username, password } = req.body;

    Users.getUsersBy({ username: username })
      .then(([user]) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = signToken(user);
          res.status(200).json({ message: "Welcome", token });
        } else {
          res.status(401).json({ message: "You shall not pass" });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  } else {
    res.status(400).json({
      message: "please provide a username and password",
    });
  }
});

function signToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  };

  const secret = constants.jwtSecret;

  const options = {
    expiresIn: "1h",
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
