module.exports = {
    ensureAuthenticated: (req, res, next) => {
        const authUser = req.session.user || req.user || null;
        if (authUser) {
            return next();
        }
        req.flash('error_msg', 'Not Authorized!');
        res.redirect('/user/login');
    },
    redirectIfAuthenticated: (req, res, next) => {
      const authUser = req.session.user || req.user || null;
        if (!authUser) {
            return next();
        }
        res.redirect('/');
    }
};