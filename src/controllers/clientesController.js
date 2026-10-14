const supabase = require('../config/database')

const getClientes = async (req, res) => {
  try {
    const { data, error } = await supabase.from('clientes').select('*')
    if (error) return res.status(500).json({ error: error.message })
    console.log('Clientes obtenidos:', data)
    res.json(data)
  } catch (err) {
    console.log('Error en getClientes:', err.message)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

const createCliente = async (req, res) => {
  try {
    const { nombre, email, telefono } = req.body
    const { data, error } = await supabase.from('clientes').insert([{ nombre, email, telefono }]).select()
    if (error) return res.status(500).json({ error: error.message })
    console.log('Cliente creado:', data[0])
    res.status(201).json(data[0])
  } catch (err) {
    console.log('Error en createCliente:', err.message)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

const updateCliente = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, email, telefono } = req.body
    const { data, error } = await supabase.from('clientes').update({ nombre, email, telefono }).eq('id', id).select()
    if (error) return res.status(500).json({ error: error.message })
    console.log('Cliente actualizado:', data[0])
    res.json(data[0])
  } catch (err) {
    console.log('Error en updateCliente:', err.message)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params
    const { error } = await supabase.from('clientes').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    console.log('Cliente eliminado, id:', id)
    res.json({ mensaje: 'Cliente eliminado' })
  } catch (err) {
    console.log('Error en deleteCliente:', err.message)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

module.exports = { getClientes, createCliente, updateCliente, deleteCliente }
