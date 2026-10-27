const JournalAction = require('../models/JournalAction');

exports.logAction = (module, action) => {
  return async (req, res, next) => {
    res.on('finish', async () => {
      if (res.statusCode < 400 && req.session && req.session.user) {
        try {
          await JournalAction.create({
            utilisateur: req.session.user.id,
            nomUtilisateur: req.session.user.prenom + ' ' + req.session.user.nom + ' (' + req.session.user.username + ')',
            action: action,
            module: module,
            details: `${req.method} ${req.originalUrl}`,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
          });
        } catch (err) {
          console.error('Erreur journalisation:', err.message);
        }
      }
    });
    next();
  };
};
