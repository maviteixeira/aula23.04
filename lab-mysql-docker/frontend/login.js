const loginForm = document.getElementById('login-form');
const usuarioInput = document.getElementById('usuario');
const senhaInput = document.getElementById('senha');
const loginBtn = document.getElementById('login-btn');
const mensagem = document.getElementById('mensagem');

const AUTH_URL = 'http://localhost:3000/auth/login';

function mostrarMensagem(texto, tipo = 'error') {
  mensagem.textContent = texto;
  mensagem.dataset.type = tipo;
}

function limparMensagem() {
  mensagem.textContent = '';
  mensagem.dataset.type = '';
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  limparMensagem();

  const usuario = usuarioInput.value.trim();
  const senha = senhaInput.value;

  loginBtn.disabled = true;
  loginBtn.innerHTML = '<span>Entrando...</span>';

  try {
    const resposta = await fetch(AUTH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        usuario,
        senha
      }),

      // Permite que o navegador guarde a sessão criada pelo Express. "oscookies"
      credentials: 'include'
    });

    if (resposta.ok) {
      window.location.href = 'index.html';
      return;
    }

    const dados = await resposta.json().catch(() => null);

    mostrarMensagem(
      dados?.erro || 'Usuário ou senha inválidos.'
    );
  } catch (error) {
    console.error('Erro ao realizar login:', error);

    mostrarMensagem(
      'Não foi possível conectar ao servidor. Verifique se os containers estão ativos.'
    );
  } finally {
    loginBtn.disabled = false;
    loginBtn.innerHTML = `
      <span>Entrar no Anotebook</span>
      <span aria-hidden="true">→</span>
    `;
  }
});