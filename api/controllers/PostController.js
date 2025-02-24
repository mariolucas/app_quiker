const Post = require("../models/Post");
const path = require("path");
const fs = require("fs");

class PostController {

    async getAllPosts(req, res){

        try {
            const posts = await Post.findAll();
            res.json({ success: true, posts });
        } catch (error) {
            res.status(500).json({ success: false, message: "Erro ao buscar posts." });
        }
    }
    
    async createPost(req, res) {
        const { title, description } = req.body;
        const user_id = req.user.id;
        let image_url = null;

        if (req.file) {
            image_url = req.file.filename;
        }

        try {
            const post = await Post.create({ title, description, image_url, user_id });
            res.json({ success: true, message: "Post criado com sucesso!", post: {
                id: post[0],
                title,
                description,
                image_url
            } });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Erro ao criar post." });
        }
    }

    async editPost(req, res) {
        console.log(req.body);
        const { post_id, title, description } = req.body;
        const updateData = { title, description };
        const user_id = req.user.id;
        let image_url = null;

        if (req.file) {
            updateData.image_url = req.file.filename;
        }

        const post = await Post.findById(post_id);
        if (!post || post.user_id !== user_id) {
            return res.status(403).json({ success: false, message: "Acesso negado." });
        }

        await Post.history(post.id, post.title, post.description);
        await Post.update(post_id, updateData);

        res.json({ success: true, message: "Post atualizado com sucesso!", post: {
            id: post_id,
            title,
            description,
            image_url
        } });
    }

    async deletePost(req, res) {
        const { post_id } = req.body;
        const user_id = req.user.id;

        const post = await Post.findById(post_id);
        if (!post || post.user_id !== user_id) {
            return res.status(403).json({ success: false, message: "Acesso negado." });
        }

        await Post.delete(post_id);
        res.json({ success: true, message: "Post excluído com sucesso!" });
    }

    async getPost(req, res) {
        const { post_id } = req.params;
        const user_id = req.user.id;

        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post não encontrado." });
        }

        await Post.registerView(user_id, post_id);

        res.json({ success: true, post });
    }

    async likePost(req, res) {
        const { post_id } = req.body;
        const user_id = req.user.id;
        await Post.likePost(user_id, post_id);
        res.json({ success: true, message: "Post curtido!" });
    }

    async unlikePost(req, res) {
        const { post_id } = req.body;
        const user_id = req.user.id;
        await Post.unlikePost(user_id, post_id);
        res.json({ success: true, message: "Você não curtiu este post!" });
    }

    async likeStatusPost(req, res) {
        const { post_id } = req.body;
        const user_id = req.user.id;
        console.log( user_id, post_id );
        let data = await Post.likeStatusPost(user_id, post_id);
        console.log(data);
        res.json({ success: true, liked: true, unlike: false });
    }

    
}

module.exports = new PostController();
