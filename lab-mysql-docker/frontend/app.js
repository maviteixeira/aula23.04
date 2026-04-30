const form = document.getElementById('login-form');
const mensagem = document.getElementById('mensagem');
const logoutBtn = document.getElementById('logout-btn');
const API_URL = 'http://localhost:3000';

function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.classList.toggle('erro', erro);
  mensagem.classList.toggle('sucesso', !erro);
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const resposta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({
      usuario: document.getElementById('usuario').value.trim(),
      senha: document.getElementById('senha').value.trim()
    })
  });

  const data = await resposta.json();
  mostrarMensagem(data.mensagem || data.erro, !resposta.ok);
});

logoutBtn.addEventListener('click', async () => {
  const resposta = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
    credentials: 'include'
  });

  const data = await resposta.json();
  mostrarMensagem(data.mensagem || data.erro, !resposta.ok);
});
