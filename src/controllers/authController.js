const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Cliente de Supabase EXCLUSIVO para auth, separado del que usan
// productosController/clientesController (config/database.js).
//
// Por qué: si usáramos el cliente compartido para signInWithPassword,
// Supabase le deja una sesión de usuario "pegada" a ese cliente, y todas
// las consultas siguientes (productos, clientes) que pasen por ese mismo
// cliente dejan de mandarse como rol "anon" y empiezan a mandarse como
// "authenticated" -> como las policies de RLS solo autorizan a "anon",
// esas consultas quedaban bloqueadas y devolvían [] después de loguearse.
// persistSession/autoRefreshToken en false evita que este cliente arrastre
// sesión entre pedidos (cada request de Vercel es, de todas formas, una
// instancia nueva o reciclada del servidor).
const supabaseAuth = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

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

    const { data, error } = await supabaseAuth.auth.signInWithPassword({ email, password })

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

    const { data, error } = await supabaseAuth.auth.signUp({ email, password })

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
