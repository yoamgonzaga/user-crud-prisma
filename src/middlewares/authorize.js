function authorize(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.userRole;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    next();
  };
}

module.exports = authorize;
