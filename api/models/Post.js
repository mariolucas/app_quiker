const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);

class Post {
    async create({ title, description, image_url, user_id }) {
        return knex("posts").insert({ title, description, image_url, user_id });
    }

    async findById(id) {
        return knex("posts").where({ id }).first();
    }

    async findAll() {
        return knex("posts").select("*");
    }

    async history(post_id, title, description){
        await knex("posts_edits").insert({ post_id, title, description }); // Salva no histórico
        return;
    }

    async update(post_id, updateData) {
        return knex("posts").where({ id: post_id }).update(updateData);
    }

    async delete(post_id) {
        return knex("posts").where({ id: post_id }).delete();
    }

    async registerView(user_id, post_id) {
        try {
            await knex("relacionamentos").insert({ user_id, post_id, type: "view" });
        } catch (error) {
            // Caso já tenha sido registrada, apenas ignora
        }
    }

    async likePost(user_id, post_id) {
        await knex("relacionamentos").where({ user_id, post_id, type: "unlike" }).delete(); // Remove 'não curti'
        return knex("relacionamentos").insert({ user_id, post_id, type: "like" }).onConflict(["user_id", "post_id", "type"]).ignore();
    }

    async unlikePost(user_id, post_id) {
        await knex("relacionamentos").where({ user_id, post_id, type: "like" }).delete(); // Remove 'curti'
        return knex("relacionamentos").insert({ user_id, post_id, type: "unlike" }).onConflict(["user_id", "post_id", "type"]).ignore();
    }

    async likeStatusPost(user_id, post_id) {
        return knex("relacionamentos").where({ user_id, post_id });
    }

    async getPostReport() {
        return knex.raw(`
            SELECT 
                p.id,
                p.title,
                COALESCE(comments.total_comments, 0) AS total_comments,
                COALESCE(likes.total_likes, 0) AS total_likes,
                COALESCE(unlikes.total_unlikes, 0) AS total_unlikes,
                COALESCE(views.total_views, 0) AS total_views
            FROM posts p
            LEFT JOIN (
                SELECT post_id, COUNT(id) AS total_comments 
                FROM comments 
                GROUP BY post_id
            ) comments ON p.id = comments.post_id
            LEFT JOIN (
                SELECT post_id, COUNT(id) AS total_likes 
                FROM relacionamentos 
                WHERE type = 'like' 
                GROUP BY post_id
            ) likes ON p.id = likes.post_id
            LEFT JOIN (
                SELECT post_id, COUNT(id) AS total_unlikes 
                FROM relacionamentos 
                WHERE type = 'unlike' 
                GROUP BY post_id
            ) unlikes ON p.id = unlikes.post_id
            LEFT JOIN (
                SELECT post_id, COUNT(DISTINCT user_id) AS total_views 
                FROM relacionamentos 
                WHERE type = 'view' 
                GROUP BY post_id
            ) views ON p.id = views.post_id
            ORDER BY p.id DESC;
        `);
    }
}

module.exports = new Post();
