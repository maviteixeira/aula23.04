const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const exigirLogin = require('./middlewares/auth');

const app = express();

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'segredo-lab',
    resave: false,
    saveUninitialized: false
  })
);

const db = mysql.createConnection({
  host: 'mysql',
  user: 'user',
  password: 'user123',
  database: 'lab_db'
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar:', err);
    return;
  }
  console.log('Conectado ao MySQL!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);

app.get('/usuarios', exigirLogin, (req, res) => {
  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log('API rodando na porta 3000');
});
