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
                    id, 
                    post_id,
                    user_id,
                    CASE 
                        WHEN deleted = 1 AND deleted_by = 'user' THEN 'Comentário excluído pelo usuário'
                        WHEN deleted = 1 AND deleted_by = 'owner' THEN 'Comentário excluído pelo dono do post'
                        ELSE description 
                    END AS description, 
                    created_at, 
                    deleted, 
                    deleted_by
                FROM comments
                WHERE post_id = ?
                ORDER BY created_at ASC
            `;
        const result = await knex.raw(query, [post_id]);
        return result[0];
    }
}

module.exports = Comment;