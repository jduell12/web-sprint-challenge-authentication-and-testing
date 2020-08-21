const db = require("../database/dbConfig");

module.exports = {
  getUsers,
  addUser,
  getUserById,
  getUsersBy,
};

function getUsers() {
  return db("users").orderBy("id");
}

async function addUser(user) {
  return db("users").insert(user);
}

async function getUserById(id) {
  return db("users").where({ id }).first();
}

async function getUsersBy(filter) {
  return db("users").where(filter).orderBy("id");
}
