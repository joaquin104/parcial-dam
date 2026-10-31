const supabase = require('../config/database')

// POST /api/login
// Valida usuario y contraseña contra Supabase Auth (tabla interna auth.users).
// El usuario de prueba hay que crearlo una vez desde el dashboard de Supabase
// (Authentication > Users > Add user) o con el endpoint /api/register de abajo.
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' })
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      console.log('Login fallido para', email, '-', error.message)
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' })
    }

    console.log('Login OK:', data.user.email)
    res.json({
      mensaje: 'Login exitoso',
      usuario: { id: data.user.id, email: data.user.email },
      token: data.session.access_token,
    })
  } catch (err) {
    console.log('Error en login:', err.message)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// POST /api/register
// Opcional: para crear usuarios de prueba sin entrar al dashboard de Supabase.
// No es requisito de la consigna, pero es útil mientras desarrollan.
const register = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' })
    }

    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      console.log('Error en register:', error.message)
      return res.status(400).json({ error: error.message })
    }

    console.log('Usuario registrado:', email)
    res.status(201).json({ mensaje: 'Usuario creado', usuario: { id: data.user.id, email: data.user.email } })
  } catch (err) {
    console.log('Error en register:', err.message)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

module.exports = { login, register }
