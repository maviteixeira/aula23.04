const express = require('express');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { erro: 'Muitas tentativas de login. Tente novamente mais tarde.' }
});

function compararSeguro(valor, esperado) {
  const bufferValor = Buffer.from(String(valor));
  const bufferEsperado = Buffer.from(String(esperado || ''));

  if (bufferValor.length !== bufferEsperado.length) {
    return false;
  }

  return crypto.timingSafeEqual(bufferValor, bufferEsperado);
}

router.post('/login', loginLimiter, (req, res) => {
  const { usuario, senha } = req.body;

  if (typeof usuario !== 'string' || typeof senha !== 'string') {
    return res.status(400).json({ erro: 'Usuário e senha são obrigatórios.' });
  }

  const usuarioValido = compararSeguro(usuario, process.env.ADMIN_USER);
  const senhaValida = compararSeguro(senha, process.env.ADMIN_PASSWORD);

  if (!usuarioValido || !senhaValida) {
    return res.status(401).json({ erro: 'Credenciais invalidas' });
  }

  req.session.regenerate((err) => {
    if (err) {
      return res.status(500).json({ erro: 'Erro ao iniciar a sessão.' });
    }

    req.session.usuario = { nome: usuario };
    return res.json({ mensagem: 'Login realizado com sucesso' });
  });
});

router.post('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ erro: 'Erro ao realizar logout' });
      }
      res.clearCookie('connect.sid'); // Limpa o cookie da sessão
      res.json({ mensagem: 'Logout realizado com sucesso' });
    });
  } else {
    res.json({ mensagem: 'Sessao ja encerrada' });
  }
});

module.exports = router;