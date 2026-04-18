const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createPost(title, content, userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    const error = new Error("Usuario no existe");
    error.code = "P2025";
    throw error;
  }

  return prisma.post.create({
    data: {
      title,
      content,
      userId,
      completed: false,
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
  return prisma.post.findMany({
    where: { userId },
    select: {
      id: true,
      title: true,
      content: true,
      completed: true,
    },
  });
}

async function updatePost(id, { title, content, completed }) {
  const data = {};

  if (title !== undefined) data.title = title;
  if (content !== undefined) data.content = content;
  if (completed !== undefined) data.completed = completed;

  try {
    return await prisma.post.update({
      where: { id },
      data,
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("Post no encontrado");
    }
    throw error;
  }
}

async function deletePost(id) {
  return prisma.post.delete({
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
