const express = require('express');

const router = express.Router();

router.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === 'admin' && senha === '123456') {
    req.session.usuario = { nome: 'admin' };
    return res.json({ mensagem: 'Login realizado com sucesso' });
  }

  return res.status(401).json({ erro: 'Credenciais invalidas' });
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