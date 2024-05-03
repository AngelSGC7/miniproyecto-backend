// ID de los clientes de la Ciudad de Monterrey
knex.select('ID', 'Nombre')
  .from('Clientes')
  .where('Ciudad', 'Monterrey')
  .then(rows => {
    console.log(rows)
  })
  .catch(err => {
    console.error(err)
  })

// ID y descripción de los productos que cuesten menos de 15 pesos
knex.select('ID', 'Descripcion')
  .from('Productos')
  .where('Precio', '<', 15)
  .then(rows => {
    console.log(rows)
  })
  .catch(err => {
    console.error(err)
  })

// ID y nombre de los clientes, cantidad vendida, y descripción del producto, en las ventas en las cuales se vendieron más de 10 unidades
knex.select('c.ID', 'c.Nombre', 'dv.Cantidad', 'p.Descripcion')
  .from('Clientes as c')
  .join('Ventas as v', 'c.ID', 'v.ID_Cliente')
  .join('Detalles_Ventas as dv', 'v.ID', 'dv.ID_Venta')
  .join('Productos as p', 'dv.ID_Producto', 'p.ID')
  .where('dv.Cantidad', '>', 10)
  .then(rows => {
    console.log(rows)
  })
  .catch(err => {
    console.error(err)
  })

// ID y nombre de los clientes que no aparecen en la tabla de ventas (Clientes que no han comprado productos)
knex.select('ID', 'Nombre')
  .from('Clientes')
  .whereNotIn('ID', function () {
    this.select('ID_Cliente')
      .from('Ventas')
      .distinct()
  })
  .then(rows => {
    console.log(rows)
  })
  .catch(err => {
    console.error(err)
  })

// ID y nombre de los clientes que han comprado todos los productos de la empresa
knex.select('c.ID', 'c.Nombre')
  .from('Clientes as c')
  .whereNotExists(function () {
    this.select('*')
      .from('Productos')
      .whereNotExists(function () {
        this.select('*')
          .from('Detalles_Ventas as dv')
          .join('Ventas as v', 'dv.ID_Venta', 'v.ID')
          .whereRaw('v.ID_Cliente = c.ID')
          .whereRaw('dv.ID_Producto = Productos.ID')
      })
  })
  .then(rows => {
    console.log(rows)
  })
  .catch(err => {
    console.error(err)
  })

// ID y nombre de cada cliente y la suma total (suma de cantidad) de los productos que ha comprado
knex.select('c.ID', 'c.Nombre')
  .sum('dv.Cantidad as Total_Productos_Comprados')
  .from('Clientes as c')
  .leftJoin('Ventas as v', 'c.ID', 'v.ID_Cliente')
  .leftJoin('Detalles_Ventas as dv', 'v.ID', 'dv.ID_Venta')
  .groupBy('c.ID', 'c.Nombre')
  .then(rows => {
    console.log(rows)
  })
  .catch(err => {
    console.error(err)
  })

// ID de los productos que no han sido comprados por clientes de Guadalajara
knex.select('ID')
  .from('Productos')
  .whereNotIn('ID', function () {
    this.select('ID_Producto')
      .from('Detalles_Ventas')
      .whereIn('ID_Venta', function () {
        this.select('ID')
          .from('Ventas')
          .whereIn('ID_Cliente', function () {
            this.select('ID')
              .from('Clientes')
              .where('Ciudad', 'Guadalajara')
          })
      })
  })
  .then(rows => {
    console.log(rows)
  })
  .catch(err => {
    console.error(err)
  })

// ID de los productos que se han vendido a clientes de Monterrey y que también se han vendido a clientes de Cancún
const subqueryMonterrey = knex.select('ID')
  .from('Clientes')
  .where('Ciudad', 'Monterrey')

const subqueryCancun = knex.select('ID')
  .from('Clientes')
  .where('Ciudad', 'Cancún')

knex.select('ID_Producto')
  .from('Detalles_Ventas')
  .whereIn('ID_Venta', function () {
    this.select('ID')
      .from('Ventas')
      .whereIn('ID_Cliente', subqueryMonterrey)
      .whereIn('ID_Cliente', subqueryCancun)
  })
  .then(rows => {
    console.log(rows)
  })
  .catch(err => {
    console.error(err)
  })

// Nombre de las ciudades en las que se han vendido todos los productos
knex.select('Ciudad')
  .from('Clientes')
  .groupBy('Ciudad')
  .having(knex.raw('COUNT(DISTINCT (SELECT ID FROM Productos))'), '=', knex.raw('(SELECT COUNT(*) FROM Productos)'))
  .then(rows => {
    console.log(rows)
  })
  .catch(err => {
    console.error(err)
  })
