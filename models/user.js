"use strict";
const bcrypt = require('bcrypt');
const db = require('../db');
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require('../config');

/** User of the site. */

class User {
  /** Register new user. Returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {

    const hashedPW = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const join = new Date();
    const result = await db.query(
            `INSERT INTO users (username, password, first_name, last_name, phone, join_at)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING username, password, first_name, last_name, phone`, 
             [username, hashedPW, first_name, last_name, phone, join],
      );
      let user = result.rows[0];
     return user;

  }

  /** Authenticate: is username/password valid? Returns boolean. */

  static async authenticate(username, password) {
      
      let userPass = await db.query(
        `SELECT password
        FROM users
        WHERE username = $1`,
        [username]
      )
      let isAuthenticated = await bcrypt.compare(password, userPass.rows[0].password)
      
      return isAuthenticated;
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    let loginAt = new Date();
    await db.query(
      `UPDATE users
      SET last_login_at = $2
      WHERE username = $1`,
      [username, loginAt]
    );
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name}, ...] */

  static async all() {
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {id, first_name, last_name, phone}
   */

  static async messagesTo(username) {
  }
}

module.exports = User;
