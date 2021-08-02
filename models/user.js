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
    console.log(username, loginAt, '--------------');
    const results = await db.query(
      `UPDATE users
      SET last_login_at = $2
      WHERE username = $1
      RETURNING username, last_login_at`,
      [username, loginAt]
    );
    console.log(results.rows[0]);
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
    const results = await db.query(
      `SELECT username,
              first_name,
              phone,
              join_at
              last_login_at
       FROM users
       WHERE username=$1`,
       [username]
    );
    const user = results.rows[0];
    //return {user.username, user.first_name, user.first_name, user.join_at,user.login_at};
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {

    const results = await db.query(
      `SELECT id,
              to_user,
              body,
              sent_at
              read_at
       FROM messages
       WHERE from_user=$1`,
       [username]
    );
    return results.rows;
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
