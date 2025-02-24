const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");
const sendEmail = require("../utils/emailService");

class CommentController {

    async createComment(req, res) {
        const { post_id, description } = req.body;
        const user_id = req.user.id;
        try {
            await Comment.create(post_id, user_id, description);

            const post = await Post.findById(post_id);
            if (post) {
                const owner = await User.findById(post.user_id); // owner = Criar da postagem
                if (owner) {
                    await sendEmail(owner.email);
                }
            }

            res.json({ success: true, message: "Comentário adicionado!" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Erro ao criar comentário." });
        }
    }

    async editComment(req, res) {
        const { comment_id, description } = req.body;
        const user_id = req.user.id;

        const comment = await Comment.findById(comment_id);
        if (!comment || comment.user_id !== user_id) {
            return res.status(403).json({ success: false, message: "Acesso negado." });
        }

        await Comment.update(comment_id, description);
        res.json({ success: true, message: "Comentário atualizado!" });
    }

    async deleteComment(req, res) {
        const comment_id = req.params.comment_id;
        const user_id = req.user.id;

        const comment = await Comment.findById(comment_id);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comentário não encontrado." });
        }

        const post = await Post.findById(comment.post_id);
        if (comment.user_id !== user_id && post.user_id !== user_id) {
            return res.status(403).json({ success: false, message: "Acesso negado." });
        }

        const deleted_by = comment.user_id === user_id ? "user" : "owner";
        await Comment.delete(comment_id, deleted_by);

        res.json({ success: true, message: "Comentário excluído!" });
    }

    async getComments(req, res) {
        const { post_id } = req.params;
        const comments = await Comment.getCommentsByPost(post_id);
        res.json({ success: true, comments });
    }
}

module.exports = new CommentController();
