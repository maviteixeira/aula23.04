const loginForm = document.getElementById('login-form');
const mensagem = document.getElementById('mensagem');

const AUTH_URL = 'http://localhost:3000/auth/login';

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;

  try {
    const resposta = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ usuario, senha })
    });

    if (resposta.ok) {
      window.location.href = 'index.html';
    } else {
      const erro = await resposta.json();
      mensagem.textContent = erro.erro || 'Falha no login';
      mensagem.style.color = '#b42318';
    }
  } catch (error) {
    mensagem.textContent = 'Erro ao conectar com o servidor';
    mensagem.style.color = '#b42318';
  }
});