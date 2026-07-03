require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const atividadesRoutes = require('./routes/atividades');
const authRoutes = require('./routes/auth');

if (!process.env.SESSION_SECRET) {
  throw new Error(
    'SESSION_SECRET nao definido. Configure essa variavel de ambiente antes de iniciar o servidor.'
  );
}

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.disable('x-powered-by');
app.use(helmet());

app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true
}));

app.options('*', cors());

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(
  session({
    name: 'anotebook.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 2
    }
  })
);

const limitadorGeral = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limitadorGeral);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/atividades', atividadesRoutes);

app.listen(3000, () => {
  console.log('API rodando na porta 3000');
});