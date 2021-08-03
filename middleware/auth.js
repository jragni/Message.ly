"use strict";

/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken");

const Message = require('../models/message');
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

/** Middleware: Authenticate user. */

function authenticateJWT(req, res, next) {
  try {
    const tokenFromBody = req.body._token;
    const payload = jwt.verify(tokenFromBody, SECRET_KEY);
    res.locals.user = payload;
    return next();
  } catch (err) {
    // error in this middleware isn't error -- continue on
    return next();
  }
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
  try {
    if (!res.locals.user) {
      throw new UnauthorizedError();
    } else {
      return next();
    }
  } catch (err) {
    return next(err);
  }
}

/** Middleware: Requires user is user for route. */

function ensureCorrectUser(req, res, next) {
  try {
    if (!res.locals.user ||
      res.locals.user.username !== req.params.username) {
      throw new UnauthorizedError();
    } else {
      return next();
    }
  } catch (err) {
    return next(err);
  }
}

/* Middleware: Validating that the user is the correct user being sent to */
async function ensureCorrectToUser(req, res, next) {
  try {
    let message = await Message.get(req.params.id);
    if (!res.locals.user ||
      res.locals.user.username !== message.to_user.username) {
      throw new UnauthorizedError();
    } else {
      return next();
    }
  } catch (err) {
    return next(err);
  }
}

async function ensureCorrectToOrFromUser(req, res, next) {
  try {
    let message = await Message.get(req.params.id);
    if (!res.locals.user ||
      res.locals.user.username !== 
      (message.to_user.username || message.from_user.username)) {
      throw new UnauthorizedError();
    } else {
      return next();
    }
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  ensureCorrectToUser,
  ensureCorrectToOrFromUser
};
