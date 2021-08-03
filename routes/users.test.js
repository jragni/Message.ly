"use strict";

const request = require("supertest");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require('../config');
const app = require("../app");
const db = require("../db");
const User = require("../models/user");


describe("User Routes Test", function () {

  beforeEach(async function () {
    await db.query("DELETE FROM messages");
    await db.query("DELETE FROM users");

    let u1 = await User.register({
      username: "test1",
      password: "password",
      first_name: "Test1",
      last_name: "Testy1",
      phone: "+14155550000",
    });
    
  });

  /** POST /auth/register => token  */

  describe("GET /users", function () {
    test("Can't see list of users if not logged in", async function () {
      let response = await request(app)
        .get("/users")
        .send({
          _token : "invalid token"
        });

      expect(response.status).toEqual(401);
    });
    
    test("Can see list of users if logged in", async function () {
        
      let token = jwt.sign({username: "test1"}, SECRET_KEY);
        
      let response = await request(app)
        .get("/users")
        .send({
          _token : token
        });

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
          "users": expect.any(Array)
      })
    });
  });

  
  /** POST /auth/login => token  */

  // describe("POST /auth/login", function () {
    // test("can login", async function () {
      // let response = await request(app)
        // .post("/auth/login")
        // .send({ username: "test1", password: "password" });

      // let token = response.body.token;
      // expect(jwt.decode(token)).toEqual({
        // username: "test1",
        // iat: expect.any(Number)
      // });
    // });

    // test("won't login w/wrong password", async function () {
      // let response = await request(app)
        // .post("/auth/login")
        // .send({ username: "test1", password: "WRONG" });
      // expect(response.statusCode).toEqual(400);
    // });

    // test("won't login w/wrong password", async function () {
      // let response = await request(app)
        // .post("/auth/login")
        // .send({ username: "not-user", password: "password" });
      // expect(response.statusCode).toEqual(400);
    // });
  // });
});

afterAll(async function () {
  await db.end();
});
