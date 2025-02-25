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

        const post = await Post.findById(post_id, user_id);
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

    async likeStatus(req, res) {
        const post_id= req.params.post_id;
        const user_id = req.user.id;
        let data = await Post.likeStatus(user_id, post_id);

        if(data.length > 0){
            data = JSON.parse( data[0].status);
            res.json({ success: true, data: data });
        } else {
            res.json({ success: false });
        }
    }

    async stats(req, res) {
        try {
          const { post_id } = req.params;
    
          if (!post_id || isNaN(post_id)) {
            return res.status(400).json({ error: "ID do post inválido" });
          }
    
          const result = await Post.getPostStats(post_id);
    
          if (!result[0] || result[0].length === 0) {
            return res.json({
              post_id,
              total_likes: 0,
              total_unlikes: 0,
              total_views: 0
            });
          }
    
          const stats = result[0][0];
    
          return res.json({
            post_id: stats.post_id,
            total_likes: stats.total_likes || 0,
            total_unlikes: stats.total_unlikes || 0,
            total_views: stats.total_views || 0
          });
    
        } catch (error) {
          console.error("Erro ao buscar estatísticas do post:", error);
          return res.status(500).json({ error: "Erro ao buscar estatísticas" });
        }
      }

    
}

module.exports = new PostController();
