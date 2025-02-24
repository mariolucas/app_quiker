exports.up = function(knex) {
  return knex.schema.createTable("comments", function(table) {
      table.increments("id").primary();
      table.integer("post_id").unsigned().references("id").inTable("posts").onDelete("CASCADE");
      table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
      table.text("description").notNullable();
      table.boolean("deleted").defaultTo(false);
      table.string("deleted_by").nullable(); // "user" ou "owner"
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("comments");
};