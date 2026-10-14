const express = require('express')
const router = express.Router()
const { getClientes, createCliente, updateCliente, deleteCliente } = require('../controllers/clientesController')

router.get('/cliente', getClientes)
router.post('/clientes', createCliente)
router.put('/clientes/:id', updateCliente)
router.delete('/clientes/:id', deleteCliente)

module.exports = router
