exports.up = function(knex) {
  return knex.schema.createTable('relacionamentos', (table) => {
    table.increments('id').primary();
    table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
    table.integer("post_id").unsigned().references("id").inTable("posts").onDelete("CASCADE");
    table.string('type', 6).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('relacionamentos');
};
