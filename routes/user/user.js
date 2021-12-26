const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/expressError');
const User = require('../../models/user');
const passport = require('passport');

// joi
const userSchema = require('../../joiSchemas/joi_user');
// joi

const validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(element => element["message"]).join(',');
    throw new ExpressError(400, msg)
  } else {
    next()
  }
}

const _feRegister = catchAsync( async (req, res) => {
    switch (req.method) {
        case "POST":
            try {
                const { email, username, password } = req.body.user;
                const newUser = new User({ email, username });
                const registeredUser = await User.register(newUser, password);
                req.login(registeredUser, err => {
                    // after registration is successful, immediately login for user. :)
                    if (err) {
                        return next(err);
                    } else {
                        req.flash('success', `Welcome to yYelpCamp, ${registeredUser.username}!`);
                        res.redirect('/campgrounds');
                    }
                })
                break;
            } catch (err) {
                req.flash('error', err.message);
                res.redirect('/register');
                break;
            }
        default:
            res.render('register.ejs');
    }
})

const _feLogin = catchAsync(async (req, res) => {
    switch (req.method) {
        case "POST":
            const { username } = req.body;
            req.flash('success', `Welcome back, ${username}!`);
            const redirectBackTo = req.session.returnTo || '/campgrounds';
            delete req.session.returnTo;
            res.redirect(redirectBackTo);
            break;
        default:
            res.render('login.ejs')
    }
})

const _feLogout = (async (req, res) => {
    req.logout();
    req.flash('success', `Successfully logged out.`);
    res.redirect('/campgrounds');
})

router.get('/register', _feRegister);
router.post('/register', validateUser, _feRegister);
router.get('/login', _feLogin);
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), _feLogin);
router.get('/logout', _feLogout);

module.exports = router;