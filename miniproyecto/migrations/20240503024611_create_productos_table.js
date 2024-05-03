/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('Productos', function (table) {
    table.increments('ID').primary()
    table.string('Nombre', 100)
    table.text('Descripcion')
    table.decimal('Precio', 10, 2)
    table.string('SKU', 50)
  })
}

/**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
exports.down = function (knex) {
  return knex.schema.dropTable('Productos')
}
