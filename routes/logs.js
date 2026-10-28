const express = require('express');
const router = express.Router();
const JournalAction = require('../models/JournalAction');
const { isAuthenticated } = require('../middlewares/auth');
const { checkRole } = require('../middlewares/checkRole');

router.get('/', isAuthenticated, checkRole('admin', 'superadmin'), async (req, res) => {
  try {
    const logs = await JournalAction.find().populate('utilisateur').sort({ dateAction: -1 }).limit(200);
    res.render('logs/index', { title: 'Journal d\'activité', logs, user: req.session.user });
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

module.exports = router;
