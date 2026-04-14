const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function ownership(req, res, next) {
  try {
    const postId = parseInt(req.params.id);

    if (isNaN(postId)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json({ error: "Post no encontrado" });
    }

    // 🔥 ADMIN puede todo
    if (req.userRole === "ADMIN") {
      return next();
    }

    // 🔐 Validar propiedad
    if (post.userId !== req.userId) {
      return res.status(403).json({
        error: "No tienes permiso sobre este recurso",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = ownership;
