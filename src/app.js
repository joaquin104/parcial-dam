const express = require('express')
const cors = require('cors')
require('dotenv').config()

const clientesRoutes = require('./routes/clientesRoutes')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api', clientesRoutes)

app.get('/', (req, res) => {
  res.json({ mensaje: 'Backend del parcial funcionando' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})

module.exports = app
