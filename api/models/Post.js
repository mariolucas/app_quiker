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

    async likeStatus(user_id, post_id) {
        const sql = `
            SELECT 
                CASE
                    WHEN type = 'like' THEN '{ "liked": true, "unliked": false }'
                    WHEN type = 'unlike' THEN '{ "liked": false, "unliked": true }'
                    ELSE '{ "liked": false, "unliked": false }'
                END as status
            FROM relacionamentos
            WHERE user_id = ? AND post_id = ? AND type <> 'view'
            LIMIT 1
        `;

        let res = await knex.raw(sql, [user_id, post_id]);        
        return res[0];
    }

    async getPostReport() {
        return knex.raw(`
            SELECT 
                p.id AS post_id,
                p.title AS title,
                COALESCE(c.total_comments, 0) AS total_comments,
                COALESCE(r.total_likes, 0) AS total_likes,
                COALESCE(r.total_unlikes, 0) AS total_unlikes,
                COALESCE(r.total_views, 0) AS total_views
            FROM posts p
            LEFT JOIN (
                SELECT post_id, COUNT(*) AS total_comments
                FROM comments
                GROUP BY post_id
            ) c ON p.id = c.post_id
            LEFT JOIN (
                SELECT 
                    post_id,
                    COUNT(CASE WHEN type = 'like' THEN 1 END) AS total_likes,
                    COUNT(CASE WHEN type = 'unlike' THEN 1 END) AS total_unlikes,
                    COUNT(CASE WHEN type = 'view' THEN 1 END) AS total_views
                FROM relacionamentos
                GROUP BY post_id
            ) r ON p.id = r.post_id;
        `);
    }

    async getPostStats(post_id) {
        const sql = `
          SELECT post_id,
            SUM(CASE WHEN type = 'like' THEN 1 ELSE 0 END) AS total_likes,
            SUM(CASE WHEN type = 'unlike' THEN 1 ELSE 0 END) AS total_unlikes,
            SUM(CASE WHEN type = 'view' THEN 1 ELSE 0 END) AS total_views
          FROM relacionamentos
          WHERE post_id = ?
          GROUP BY post_id
        `;

        return await knex.raw(sql,[post_id]);
      }
}

module.exports = new Post();
