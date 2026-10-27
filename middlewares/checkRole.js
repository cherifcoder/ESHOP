exports.checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }
    if (!roles.includes(req.session.user.role)) {
      req.flash = req.flash || function() { return []; };
      req.flash('error', 'Accès non autorisé pour ce rôle');
      return res.status(403).render('errors/403', { title: 'Accès refusé', user: req.session.user });
    }
    next();
  };
};
