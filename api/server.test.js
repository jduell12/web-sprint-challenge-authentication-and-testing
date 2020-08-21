const supertest = require("supertest");
const server = require("./server");
const db = require("../database/dbConfig");

describe("server", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });

  describe("GET /", () => {
    it("returns 200 OK", async () => {
      const res = await supertest(server).get("/");
      expect(res.status).toBe(200);
    });

    it("returns json object {server: working}", async () => {
      const res = await supertest(server).get("/");
      expect(res.body.server).toBe("working");
    });
  });

  describe("/api/auth", () => {
    describe("POST /register", () => {
      it("adds a new user to an empty db", async () => {
        const users = await db("users");
        expect(users).toHaveLength(0);

        await supertest(server)
          .post("/api/auth/register")
          .send({ username: "sam", password: "pass" });

        const newUsers = await db("users");
        expect(newUsers).toHaveLength(1);
      });

      it("adds a new user to a db with users in it", async () => {
        const users = await db("users");
        expect(users).toHaveLength(0);

        await supertest(server)
          .post("/api/auth/register")
          .send({ username: "sam", password: "pass" });
        await supertest(server)
          .post("/api/auth/register")
          .send({ username: "kelly", password: "pass" });
        await supertest(server)
          .post("/api/auth/register")
          .send({ username: "wolf", password: "pass" });

        const newUsers = await db("users");
        expect(newUsers).toHaveLength(3);
      });

      it("returns 201 OK when user is created correctly", async () => {
        const res = await supertest(server)
          .post("/api/auth/register")
          .send({ username: "sam", password: "pass" });

        expect(res.status).toBe(201);
      });

      it("returns 400 when user is not created due to no username", async () => {
        const res = await supertest(server)
          .post("/api/auth/register")
          .send({ password: "pass" });

        expect(res.status).toBe(400);
      });

      it("returns 400 when user is not created due to no password", async () => {
        const res = await supertest(server)
          .post("/api/auth/register")
          .send({ username: "pass" });

        expect(res.status).toBe(400);
      });

      it("returns 400 when user is not created due to no password", async () => {
        const res = await supertest(server).post("/api/auth/register").send();

        expect(res.status).toBe(400);
      });
    });

    describe("POST /login", () => {
      it.todo("returns 400 when no username is provided");
      it.todo("returns 400 when no password is provided");
      it.todo("returns 400 when no password and no username is provided");
      it.todo("returns 200 OK when logging in successfully");
      it.todo(
        "returns json object {message: Welcome} when login is successful",
      );
      it.todo("returns jwt token when login is sucessful");
      it.todo("returns 401 when password is not correct");
    });
  });
});
