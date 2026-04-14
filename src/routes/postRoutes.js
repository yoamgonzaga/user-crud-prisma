const express = require("express");
const router = express.Router();

const postController = require("../controllers/postController");
const auth = require("../middlewares/auth");
const ownership = require("../middlewares/ownership");
const authorize = require("../middlewares/authorize");

router.post("/posts", auth, postController.createPost);
router.get("/posts", auth, authorize("ADMIN"), postController.getPosts);
router.get("/users/:userId/posts", postController.getPostsByUser);
router.get("/my-posts", auth, postController.getMyPosts);
router.put("/posts/:id", auth, ownership, postController.updatePost);

router.delete("/posts/:id", auth, ownership, postController.deletePost);

module.exports = router;
