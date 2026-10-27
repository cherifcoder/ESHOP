require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo').default || require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
const connectDB = require('./config/db');
const flash = require('connect-flash');

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 8 }
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.currentPath = req.path;
  res.locals.messages = req.flash();
  next();
});

app.use('/auth', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/users', require('./routes/users'));
app.use('/articles', require('./routes/articles'));
app.use('/clients', require('./routes/clients'));
app.use('/ventes', require('./routes/ventes'));
app.use('/credits', require('./routes/credits'));
app.use('/stocks', require('./routes/stocks'));
app.use('/depenses', require('./routes/depenses'));
app.use('/rapports', require('./routes/rapports'));
app.use('/logs', require('./routes/logs'));

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard');
  } else {
    res.redirect('/auth/login');
  }
});

app.use((req, res) => {
  res.status(404).render('errors/404', { title: 'Page non trouvée', user: req.session.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
