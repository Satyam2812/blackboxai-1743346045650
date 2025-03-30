module.exports = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).render('error', {
    message: 'Access denied. Admin privileges required.'
  });
};