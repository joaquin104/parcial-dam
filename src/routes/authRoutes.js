const express = require('express')
const router = express.Router()
const { login, register } = require('../controllers/authController')

router.post('/login', login)
router.post('/register', register) // opcional, para crear usuarios de prueba

module.exports = router
