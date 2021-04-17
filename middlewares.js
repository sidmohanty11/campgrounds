module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must Login!');
        return res.redirect('/login');
    }
    next();
}