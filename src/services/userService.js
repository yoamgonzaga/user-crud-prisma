const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function createUser(name, email, password) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
}

async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

async function getUsersWithPosts() {
  return await prisma.user.findMany({
    include: {
      posts: true,
    },
  });
}

async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
}

async function updateUser(id, name) {
  return await prisma.user.update({
    where: { id },
    data: { name },
  });
}

async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id },
  });
}

async function loginUser(email, password) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw { code: "AUTH_ERROR", message: "Usuario no encontrado" };
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw { code: "AUTH_ERROR", message: "Credenciales inválidas" };
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    },
  );

  return token;
}

module.exports = {
  createUser,
  getUsers,
  getUsersWithPosts,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
};
