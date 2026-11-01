const express = require('express')
const cors = require('cors')
require('dotenv').config()

const clientesRoutes = require('./routes/clientesRoutes')
const productosRoutes = require('./routes/productosRoutes')
const authRoutes = require('./routes/authRoutes')
const supabase = require('./config/database')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', authRoutes)
app.use('/api', productosRoutes)
app.use('/api', clientesRoutes)

app.get('/', (req, res) => {
  res.json({ mensaje: 'Backend del parcial funcionando' })
})

// TEMPORAL - solo para diagnosticar. Borrar después.
// Muestra si el cliente COMPARTIDO (el que usan productos/clientes) tiene
// una sesión de usuario pegada, y con qué rol está consultando Supabase ahora mismo.
app.get('/api/debug-session', async (req, res) => {
  const { data, error } = await supabase.auth.getSession()
  const { data: prueba, error: errorPrueba } = await supabase.from('productos').select('id').limit(1)
  res.json({
    tieneSesionElClienteCompartido: !!data?.session,
    usuarioDeEsaSesion: data?.session?.user?.email || null,
    errorGetSession: error?.message || null,
    pruebaSelectProductos: prueba,
    errorSelectProductos: errorPrueba?.message || null,
  })
})

// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})

module.exports = app
