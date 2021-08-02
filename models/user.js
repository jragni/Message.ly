"use strict";
const bcrypt = require('bcrypt');
const db = require('../db');
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require('../config');

/** User of the site. */

class User {
  constructor(username, password, firstName, lastName, phone){
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.hashedPW = password;
  
  }
  /** Register new user. Returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({ username, password, first_name, last_name, phone }) {

    const hashedPW = bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    let user = new User(username, hashedPW, first_name, last_name, phone);
    const result = await db.query(
            `INSERT INTO users (username, password, first_name, last_name, phone)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING 
             ($1, $2, $3, $4, $5)`, 
             [user.username, user.hashedPw, user.firstName, user.lastName, user.phone],
             
      );
     return {...result.rows[0]};

  }

  /** Authenticate: is username/password valid? Returns boolean. */

  static async authenticate(username, password) {
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
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
