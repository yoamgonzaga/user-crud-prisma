const postService = require("../services/postService");

async function createPost(req, res, next) {
  try {
    const { title, content } = req.body;
    const userId = req.userId;
    if (!title) {
      return res.status(400).json({ error: "Título requerido" });
    }
    const post = await postService.createPost(title, content, userId);

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
}

async function getPosts(req, res, next) {
  try {
    const posts = await postService.getPosts();
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

async function getPostsByUser(req, res, next) {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const posts = await postService.getPostsByUser(userId);

    res.json(posts);
  } catch (error) {
    next(error);
  }
}

async function getMyPosts(req, res, next) {
  try {
    const posts = await postService.getPostsByUser(req.userId);
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

async function updatePost(req, res, next) {
  try {
    const id = parseInt(req.params.id);
    const { title, content } = req.body;

    const post = await postService.updatePost(id, title, content);

    res.json(post);
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    const id = parseInt(req.params.id);

    await postService.deletePost(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createPost,
  getPosts,
  getPostsByUser,
  getMyPosts,
  updatePost,
  deletePost,
};
