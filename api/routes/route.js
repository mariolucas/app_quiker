const express = require('express');
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const PostController = require("../controllers/PostController");
const ProfileController = require("../controllers/ProfileController");
const CommentController = require("../controllers/CommentController");
const PostReportController = require("../controllers/PostReportController");

const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const path = require('path');

// Configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/"); // Pasta onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Renomeia o arquivo para evitar conflitos
    }
});

const upload = multer({ storage });

//Home 
router.get('/', PostController.getAllPosts);

// Rotas de autenticação
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Rotas protegidas
router.get("/profile", authMiddleware, ProfileController.getProfile);
router.put("/profile", authMiddleware, ProfileController.updateProfile);

// Rota Relatorio Posts
router.get("/posts/report", PostReportController.getReport);

// Rotas Posts
router.get('/posts', authMiddleware, PostController.getAllPosts);
router.post("/posts", authMiddleware, upload.single("image"), PostController.createPost);
router.put("/posts/edit", authMiddleware, upload.single("image"), PostController.editPost);
router.delete("/posts/delete", authMiddleware, PostController.deletePost);
router.post("/posts/like", authMiddleware, PostController.likePost);
router.post("/posts/unlike", authMiddleware, PostController.unlikePost);
router.get("/posts/:post_id/like-status", authMiddleware, PostController.likeStatus);
router.get("/posts/:post_id/stats", authMiddleware, PostController.stats);
router.get("/posts/:post_id", authMiddleware, PostController.getPost);


// Rotas Comenários
router.post("/comments", authMiddleware, CommentController.createComment);
router.put("/comments", authMiddleware, CommentController.editComment);
router.delete("/comments/:comment_id", authMiddleware, CommentController.deleteComment);
router.get("/posts/:post_id/comments", authMiddleware, CommentController.getComments);

module.exports = router;
