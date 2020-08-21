const Users = require("./usersModel");
const db = require("../database/dbConfig");
const { expectCt } = require("helmet");

describe("users model", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  describe("get users", () => {
    it("retrieves an empty array when no users in db", async () => {
      let numUsers = await db("users");
      let functionNum = await Users.getUsers();

      expect(numUsers).toHaveLength(0);
      expect(functionNum).toHaveLength(0);
    });

    it("retrieves a list of users when users are in db", async () => {
      await db("users").insert({ username: "sam", password: "kelly" });

      let numUsers = await Users.getUsers();

      expect(numUsers).toHaveLength(1);
    });
  });

  describe("add users", () => {
    it("adds a user to the database", async () => {
      await Users.addUser({ username: "sam", password: "pass" });
      let count = await db("users");

      expect(count).toHaveLength(1);
    });

    it("adds multiple users to the database", async () => {
      await Users.addUser({ username: "sam", password: "pass" });
      await Users.addUser({ username: "frodo", password: "pass" });
      await Users.addUser({ username: "merry", password: "pass" });
      await Users.addUser({ username: "pippin", password: "pass" });
      let count = await db("users");

      expect(count).toHaveLength(4);
    });
  });

  describe("get user by id", () => {
    it("returns a user with matching id ", async () => {
      await db("users").insert({ username: "sam", password: "pass" });

      const user = await Users.getUserById(1);

      expect(user).not.toBeNull();
      expect(user).toEqual({ id: 1, username: "sam", password: "pass" });
    });

    it("returns an error when no user with matching id", async () => {
      const user = await Users.getUserById(1);
      expect(user).toBeUndefined();
    });
  });

  describe("get user by username", () => {
    it("retrieves correct user by username", async () => {
      await db("users").insert({ username: "sam", password: "pass" });
      await db("users").insert({
        username: "frodo",
        password: "pass",
      });
      await db("users").insert({
        username: "merry",
        password: "pass",
      });
      await db("users").insert({
        username: "pippin",
        password: "pass",
      });

      let user = await Users.getUsersBy({ username: "sam" });
      expect(user[0]).toEqual({ id: 1, username: "sam", password: "pass" });
    });

    it("returns undefined if no user by the username", async () => {
      await db("users").insert({ username: "sam", password: "pass" });
      await db("users").insert({
        username: "frodo",
        password: "pass",
      });
      await db("users").insert({
        username: "merry",
        password: "pass",
      });
      await db("users").insert({
        username: "pippin",
        password: "pass",
      });

      let user = await Users.getUsersBy({ username: "sammy" });
      expect(user[0]).toBeUndefined();
    });
  });
});
