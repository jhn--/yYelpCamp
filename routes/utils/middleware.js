const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash('error', "You must be signed in.");
        res.redirect('/login');
    }
}

module.exports = isLoggedIn;