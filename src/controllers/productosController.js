const supabase = require('../config/database')

// GET /api/productos
// GET /api/productos?nombre=texto        -> filtra por nombre (contiene, case-insensitive)
// GET /api/productos?categoria=vacuno    -> filtra por categoria exacta
const getProductos = async (req, res) => {
  try {
    const { nombre, categoria } = req.query

    let query = supabase.from('productos').select('*').order('nombre', { ascending: true })

    if (nombre) {
      query = query.ilike('nombre', `%${nombre}%`)
    }
    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    const { data, error } = await query

    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
  } catch (err) {
    console.log('Error en getProductos:', err.message)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// GET /api/productos/:id
const getProductoById = async (req, res) => {
  try {
    const { id } = req.params
    const { data, error } = await supabase.from('productos').select('*').eq('id', id).single()

    if (error) return res.status(404).json({ error: 'Producto no encontrado' })
    res.json(data)
  } catch (err) {
    console.log('Error en getProductoById:', err.message)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// POST /api/productos
const createProducto = async (req, res) => {
  try {
    const { nombre, categoria, precio_kg, stock } = req.body

    if (!nombre || !categoria || precio_kg == null) {
      return res.status(400).json({ error: 'nombre, categoria y precio_kg son obligatorios' })
    }
    if (isNaN(Number(precio_kg)) || Number(precio_kg) < 0) {
      return res.status(400).json({ error: 'precio_kg tiene que ser un número positivo' })
    }

    const { data, error } = await supabase
      .from('productos')
      .insert([{ nombre, categoria, precio_kg: Number(precio_kg), stock: Number(stock) || 0 }])
      .select()

    if (error) return res.status(500).json({ error: error.message })
    res.status(201).json(data[0])
  } catch (err) {
    console.log('Error en createProducto:', err.message)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// PUT /api/productos/:id
const updateProducto = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, categoria, precio_kg, stock } = req.body

    if (precio_kg != null && (isNaN(Number(precio_kg)) || Number(precio_kg) < 0)) {
      return res.status(400).json({ error: 'precio_kg tiene que ser un número positivo' })
    }

    const { data, error } = await supabase
      .from('productos')
      .update({ nombre, categoria, precio_kg: Number(precio_kg), stock: Number(stock) })
      .eq('id', id)
      .select()

    if (error) return res.status(500).json({ error: error.message })
    if (!data || data.length === 0) return res.status(404).json({ error: 'Producto no encontrado' })
    res.json(data[0])
  } catch (err) {
    console.log('Error en updateProducto:', err.message)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// DELETE /api/productos/:id
const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params
    const { error } = await supabase.from('productos').delete().eq('id', id)

    if (error) return res.status(500).json({ error: error.message })
    res.json({ mensaje: 'Producto eliminado' })
  } catch (err) {
    console.log('Error en deleteProducto:', err.message)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

module.exports = { getProductos, getProductoById, createProducto, updateProducto, deleteProducto }
