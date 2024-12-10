/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema.createTable("notes", (table) => {
    table.increments("id").primary();
    table.string("header").notNullable();
    table.text("markdown").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.boolean("archived").defaultTo(false);
    table.integer("user_id").unsigned().references("id").inTable("users").onDelete("CASCADE");
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema.dropTable("notes");
}
