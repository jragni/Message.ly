"use strict";
const User = require('../models/user');
const { BadRequestError } = require('../expressError');
const { SECRET_KEY } = require('../config');
const jwt = require("jsonwebtoken");

const Router = require("express").Router;
const router = new Router();

/** POST /login: {username, password} => {token} */
router.post('/login', async (req, res, next) => {
	debugger
	const {username, password} = req.body;
	let user = await User.get(username);
	if(user){
		if( await User.authenticate(username, password) === true){
			let token = jwt.sign({username}, SECRET_KEY);
			return res.json({token});
		}
	}
	throw new BadRequestError();
});

/** POST /register: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 */
router.post('/register', async (req, res, next) => {
	let user = await User.register(req.body);
	let token = jwt.sign({username: user.username}, SECRET_KEY);
	User.updateLoginTimestamp(user.username);
	
	return res.json({token});
});

module.exports = router;