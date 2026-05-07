function admin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    next();
    return;
  }

  res.status(403);
  next(new Error("Not authorised as admin"));
}

module.exports = { admin };
