exports.up = function (knex) {
  return knex.schema.createTable("posts_edits", function (table) {
      table.increments("id").primary();
      table.integer("post_id").unsigned().references("id").inTable("posts").onDelete("CASCADE");
      table.string('title', 100).notNullable();
      table.text("description").notNullable();
      table.string("image_url");
      table.timestamp("edited_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('posts_edits');
};
