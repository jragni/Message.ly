"use strict";
const {
	authenticateJWT,
	ensureLoggedIn,
	ensureCorrectUser,} = require('../middleware/auth');
const User = require('../models/user');
const {UnauthorizedError} = require('../expressError');
const Router = require("express").Router;
const router = new Router();

/** POST /login: {username, password} => {token} */
router.post('/login', (req, res, next) => {
	const {username, password} = req.body;
	if( User.authenticate(username, password) === true){
		let token = jwt.sign({username}, SECRET_KEY);
		return res.json({token});
	} else {
		throw new UnauthorizedError();
	}
});

/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */

module.exports = router;