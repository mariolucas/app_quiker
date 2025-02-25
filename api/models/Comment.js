const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);

class Comment {
    static async create(post_id, user_id, description) {
        return knex("comments").insert({ post_id, user_id, description });
    }

    static async findById(comment_id) {
        return knex("comments").where("id", comment_id).first();
    }

    static async update(comment_id, description) {
        return knex("comments").where("id", comment_id).update({ description, updated_at: knex.fn.now() });
    }

    static async delete(comment_id, deleted_by) {
        return knex("comments").where("id", comment_id).update({ deleted: true, deleted_by });
    }

    static async getCommentsByPost(post_id) {
        const query = `
            SELECT 
                c.id, 
                c.post_id,
                c.user_id,
                u.name AS user_name,
                CASE 
                    WHEN c.deleted = 1 AND c.deleted_by = 'user' THEN 'Comentário excluído pelo usuário'
                    WHEN c.deleted = 1 AND c.deleted_by = 'owner' THEN 'Comentário excluído pelo dono do post'
                    ELSE c.description 
                END AS description, 
                c.created_at, 
                c.deleted, 
                c.deleted_by
            FROM comments AS c
            LEFT JOIN users AS u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at ASC
        `;
    
        const result = await knex.raw(query, [post_id]);
        return result[0];
    }    
}

module.exports = Comment;