"use strict";
const {
	authenticateJWT,
	ensureLoggedIn,
	ensureCorrectUser,
  } = require('../middleware/auth');
const User = require('../models/user');
const Router = require("express").Router;
const router = new Router();


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get('/', ensureLoggedIn, async (req, res, next)=> {
	let users = await User.all();
	return res.json({users});
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', ensureCorrectUser, async (res, req, next) => {
	const user = await User.get(req.params.username);
	return res.json({user});

});

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/to', ensureCorrectUser, async (res, req, resp) => {
	let username = req.params.username;
	const messages = await User.messagesTo(username);
	return res.json({messages});
});

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

 router.get('/:username/from', ensureCorrectUser, async (res, req, resp) => {
	let username = req.params.username;
	const messages = await User.messagesFrom(username);
	return res.json({messages});
});

module.exports = router;