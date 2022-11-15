const Router = require("express").Router;
const router = new Router();
const Message = require("../models/message");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', async function (req, res, next) {
    try {
        let message = await Message.get(req.params.id);
        return res.json({message});
    }
    catch (e) {
        return next(e);
    }
});


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', async function(req, res, next) {
    try {
        const from_username = req.body.from_username;
        const to_username = req.body.to_username;
        const body = req.body.body;
        const newMessage = await Message.create({ from_username, to_username, body });
        return res.json({newMessage});
    } catch (e) {
        return next(e);
    }
});


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.put('/:id/read', async (req, res, next) => {
    try {
        const read = await Message.markRead(req.params.id)
      return res.json(read)
    } catch (e) {
        return next(e)
    }
})


module.exports = router;