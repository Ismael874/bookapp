const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const { engine } = require('express-handlebars');
require('dotenv').config();

const app = express();

// Configuración de Handlebars
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  },
  helpers: {
    eq: (a, b) => a === b,
    lt: (a, b) => a < b,
    gt: (a, b) => a > b,
    selected: (a, b) => a == b ? 'selected' : '',
    checked: (a, b) => {
      if (Array.isArray(a)) {
        return a.includes(b.toString()) ? 'checked' : '';
      }
      return a == b ? 'checked' : '';
    }
  }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'bookapp_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Flash messages
app.use(flash());

// Variables globales para las vistas
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currentYear = new Date().getFullYear();
  next();
});

// IMPORTANTE: Importar y usar las rutas
const homeRoutes = require('./routes/homeRoutes');
const bookRoutes = require('./routes/bookRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authorRoutes = require('./routes/authorRoutes');
const publisherRoutes = require('./routes/publisherRoutes');

app.use('/', homeRoutes);
app.use('/books', bookRoutes);
app.use('/categories', categoryRoutes);
app.use('/authors', authorRoutes);
app.use('/publishers', publisherRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).render('404', {
    title: 'Página no encontrada',
    layout: 'main'
  });
});

module.exports = app;