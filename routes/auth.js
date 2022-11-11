const jwt = require("jsonwebtoken");
const Router = require("express").Router;
const router = new Router();
const User = require("../models/user");
const {SECRET_KEY} = require("../config");
const ExpressError = require("../expressError");

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

 router.post('/login', async function (req, res, next) {
    try {
        let {username, password} = req.body;
        if (!username || !password) {
            throw new ExpressError('Username and password required', 400);
        }
        if (await User.authenticate(username, password)) {
            let token = jwt.sign({username}, SECRET_KEY);
            User.updateLoginTimestamp(username);
            return res.json({ message: `Logged in!`, token });
        } else {
            throw new ExpressError('Invalid username/password', 400);
        }
    }
    catch (e) {
        return next(e);
    }
});


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */


router.post('/register', async function (req, res, next) {
    try {
        let {username} = await User.register(req.body);
        let token = jwt.sign({username}, SECRET_KEY);
        User.updateLoginTimestamp(username);
        return res.json({ message: `Registered!`, token });
        }
    catch (e) {
        if (e.code === '23502') {
            return next(new ExpressError('Missing required fields to register.', 400));
        }
        if (e.code === '23505') {
            return next(new ExpressError('Username taken. Please pick another!', 400));
        }
        return next(e);
    }
});
  
  
  
module.exports = router;