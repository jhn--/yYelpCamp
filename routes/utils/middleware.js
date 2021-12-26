const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.session.returnTo = req.originalUrl; // record the original URL unsigned user trying to go to into session.
        req.flash('error', "You must be signed in.");
        res.redirect('/login');
    }
}

module.exports = isLoggedIn;