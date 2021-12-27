const User = require('../models/user');
const catchAsync = require('../routes/utils/catchAsync');

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
            // delete req.session.returnTo;
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

module.exports = {
    _feRegister: _feRegister,
    _feLogin: _feLogin,
    _feLogout: _feLogout
}