"use strict";
const {
  ensureLoggedIn,
  ensureCorrectToUser,
  ensureCorrectToOrFromUser
} = require('../middleware/auth');
const Message = require('../models/message');
const Router = require("express").Router;
const router = new Router();

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Makes sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get('/:id', ensureLoggedIn, ensureCorrectToOrFromUser, 
  async(req, res, next) => {
    let message = res.locals.message;

    return res.json({message});
});

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post('/', ensureLoggedIn, async(req, res, next) => {

  let message = await Message.create({
    from_username: res.locals.user.username,
    to_username: req.body.to_username,
    body: req.body.body
  });
  return res.json({message});
  
});

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Makes sure that the only the intended recipient can mark as read.
 *
 **/
// check the to_username of the message

router.post('/:id/read', ensureLoggedIn, ensureCorrectToUser, 
  async (req, res, next) => {
    const id = req.params.id
    const message = await Message.markRead(id);
    return res.json({message});
  }
);

module.exports = router;
