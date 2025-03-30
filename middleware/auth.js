const { db } = require('../app');

module.exports = (req, res, next) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  db.get(
    'SELECT * FROM users WHERE id = ?',
    [req.session.userId],
    (err, user) => {
      if (err || !user) {
        return res.redirect('/login');
      }

      req.user = user;
      next();
    }
  );
};