/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Ventas', function (table) {
    table.increments('ID').primary()
    table.integer('ID_Cliente').unsigned().references('ID').inTable('Clientes')
    table.date('Fecha')
  })
}

/**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
exports.down = function (knex) {
  return knex.schema.dropTable('Ventas')
}
