export function ensureAdmin(req, res, next) {
    if (req.session.user && req.session.user.user_type === 'admin') {
      return next();
    } else {
      return res.status(403).send('Accès interdit : réservé aux administrateurs.');
    }
  }