const express = require('express')
const cors = require('cors')
require('dotenv').config()

const clientesRoutes = require('./routes/clientesRoutes')
const productosRoutes = require('./routes/productosRoutes')
const authRoutes = require('./routes/authRoutes')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', authRoutes)
app.use('/api', productosRoutes)
app.use('/api', clientesRoutes)

app.get('/', (req, res) => {
  res.json({ mensaje: 'Backend del parcial funcionando' })
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
