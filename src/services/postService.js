const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createPost(title, content, userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw { code: "P2025", message: "Usuario no existe" };
  }

  return await prisma.post.create({
    data: {
      title,
      content,
      userId,
    },
  });
}

async function getPosts() {
  return await prisma.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

async function getPostsByUser(userId) {
  return await prisma.post.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      content: true, // opcional según tu caso
    },
  });
}

async function updatePost(id, title, content) {
  return await prisma.post.update({
    where: { id },
    data: { title, content },
  });
}

async function deletePost(id) {
  return await prisma.post.delete({
    where: { id },
  });
}

module.exports = {
  createPost,
  getPosts,
  getPostsByUser,
  updatePost,
  deletePost,
};
