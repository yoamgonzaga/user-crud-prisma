const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");

router.post(
  "/users",
  [
    body("name").notEmpty().withMessage("Nombre requerido"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password mínimo 6 caracteres"),
  ],
  userController.createUser,
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("Password requerido"),
  ],
  userController.login,
);

router.get("/users", auth, authorize("ADMIN"), userController.getUsers);
router.get("/me", auth, userController.getMe);

router.put(
  "/users/:id",
  [body("name").notEmpty().withMessage("Nombre requerido")],
  userController.updateUser,
);

router.delete(
  "/users/:id",
  auth,
  authorize("ADMIN"),
  userController.deleteUser,
);

module.exports = router;
