const userService = require("../services/userService");
const { validationResult } = require("express-validator");
const validRoles = ["USER", "ADMIN"];

// CREATE
async function createUser(req, res, next) {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password requerido" });
    }

    if (role && !validRoles.includes(role)) {
      throw new Error("Rol inválido");
    }

    const user = await userService.createUser(name, email, password, role);

    // 🔐 NO devolver password
    const { password: _, ...safeUser } = user;

    res.status(201).json(safeUser);
  } catch (error) {
    next(error);
  }
}

// READ
async function getUsers(req, res) {
  const users = await userService.getUsers();
  res.json(users);
}

async function getMe(req, res, next) {
  try {
    const user = await userService.getUserById(req.userId);

    res.json(user);
  } catch (error) {
    next(error);
  }
}

// UPDATE
async function updateUser(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    const { name } = req.body;
    const user = await userService.updateUser(id, name);
    const { password: _, ...safeUser } = user;

    res.json(safeUser);
  } catch (error) {
    next(error);
  }
}

// DELETE
async function deleteUser(req, res, next) {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    await userService.deleteUser(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

// LOGIN
async function login(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const token = await userService.loginUser(email, password);

    res.json({ token });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  getUsers,
  getMe,
  updateUser,
  deleteUser,
  login,
};
