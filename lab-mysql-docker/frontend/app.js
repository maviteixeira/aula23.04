const form = document.getElementById('atividade-form');

const idInput = document.getElementById('atividade-id');
const tituloInput = document.getElementById('titulo');
const disciplinaInput = document.getElementById('disciplina');
const categoriaInput = document.getElementById('categoria');
const prioridadeInput = document.getElementById('prioridade');
const prazoInput = document.getElementById('prazo');
const statusInput = document.getElementById('status');
const descricaoInput = document.getElementById('descricao');

const tabela = document.getElementById('atividades-tabela');
const mensagem = document.getElementById('mensagem');
const cancelarEdicaoBtn = document.getElementById('cancelar-edicao');
const salvarBtn = document.getElementById('salvar-btn');
const formTitle = document.getElementById('form-title');
const logoutBtn = document.getElementById('logout-btn');

const contadorPendentes = document.getElementById('contador-pendentes');
const contadorAndamento = document.getElementById('contador-andamento');
const contadorConcluidas = document.getElementById('contador-concluidas');

const API_URL = 'http://localhost:3000/atividades';
const AUTH_URL = 'http://localhost:3000/auth';

/* ===============================
   MENSAGENS
================================ */

function mostrarMensagem(texto, tipo = 'success') {
  if (!mensagem) {
    console.error(
      'Elemento #mensagem não foi encontrado no index.html.'
    );
    return;
  }

  mensagem.textContent = texto;
  mensagem.dataset.type = tipo;
}

function limparMensagem() {
  mensagem.textContent = '';
  mensagem.dataset.type = '';
}

/* ===============================
   FORMULÁRIO
================================ */

function limparFormulario() {
  form.reset();

  idInput.value = '';
  statusInput.value = 'Pendente';

  formTitle.textContent = 'Adicionar atividade';
  salvarBtn.textContent = 'Salvar atividade';

  cancelarEdicaoBtn.hidden = true;
}

function formatarData(prazo) {
  const data = String(prazo || '').slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return '—';
  }

  return data.split('-').reverse().join('/');
}

/* ===============================
   RESUMO DOS CARDS
================================ */

function atualizarResumo(atividades) {
  const pendentes = atividades.filter(
    (atividade) => atividade.status === 'Pendente'
  ).length;

  const emAndamento = atividades.filter(
    (atividade) => atividade.status === 'Em andamento'
  ).length;

  const concluidas = atividades.filter(
    (atividade) => atividade.status === 'Concluída'
  ).length;

  if (contadorPendentes) {
    contadorPendentes.textContent = pendentes;
  }

  if (contadorAndamento) {
    contadorAndamento.textContent = emAndamento;
  }

  if (contadorConcluidas) {
    contadorConcluidas.textContent = concluidas;
  }
}

/* ===============================
   TABELA DE ATIVIDADES
================================ */

function criarCelula(linha, texto) {
  const celula = document.createElement('td');

  celula.textContent = texto || '—';

  linha.appendChild(celula);

  return celula;
}

function criarBadge(celula, texto, tipo) {
  const badge = document.createElement('span');

  badge.className = `activity-badge activity-badge--${tipo}`;
  badge.textContent = texto;

  celula.appendChild(badge);
}

function criarBotao(texto, classe, acao, id) {
  const botao = document.createElement('button');

  botao.type = 'button';
  botao.className = classe;
  botao.textContent = texto;
  botao.dataset.action = acao;
  botao.dataset.id = id;

  return botao;
}

function tipoPrioridade(prioridade) {
  const tipos = {
    Baixa: 'baixa',
    Média: 'media',
    Alta: 'alta'
  };

  return tipos[prioridade] || 'neutra';
}

function tipoStatus(status) {
  const tipos = {
    Pendente: 'pendente',
    'Em andamento': 'andamento',
    Concluída: 'concluida'
  };

  return tipos[status] || 'neutra';
}

function renderizarAtividades(atividades) {
  tabela.textContent = '';

  if (atividades.length === 0) {
    const linha = document.createElement('tr');
    const celula = document.createElement('td');

    celula.colSpan = 7;
    celula.className = 'empty-cell';
    celula.textContent =
      'Nenhuma atividade cadastrada até o momento.';

    linha.appendChild(celula);
    tabela.appendChild(linha);

    return;
  }

  atividades.forEach((atividade) => {
    const linha = document.createElement('tr');

    criarCelula(linha, atividade.titulo);
    criarCelula(linha, atividade.disciplina);
    criarCelula(linha, atividade.categoria);

    const prioridadeCelula = document.createElement('td');
    criarBadge(
      prioridadeCelula,
      atividade.prioridade,
      tipoPrioridade(atividade.prioridade)
    );
    linha.appendChild(prioridadeCelula);

    criarCelula(linha, formatarData(atividade.prazo));

    const statusCelula = document.createElement('td');
    criarBadge(
      statusCelula,
      atividade.status,
      tipoStatus(atividade.status)
    );
    linha.appendChild(statusCelula);

    const acoesCelula = document.createElement('td');
    acoesCelula.className = 'table-actions';

    const editarBtn = criarBotao(
      'Editar',
      'table-btn table-btn--edit',
      'editar',
      atividade.id
    );

    const excluirBtn = criarBotao(
      'Excluir',
      'table-btn table-btn--delete',
      'excluir',
      atividade.id
    );

    acoesCelula.append(editarBtn, excluirBtn);

    linha.appendChild(acoesCelula);
    tabela.appendChild(linha);
  });
}

/* ===============================
   RESPOSTAS DA API
================================ */

async function obterMensagemErro(resposta, mensagemPadrao) {
  const dados = await resposta.json().catch(() => null);

  return dados?.erro || mensagemPadrao;
}

/* ===============================
   LISTAR ATIVIDADES
================================ */

async function carregarAtividades() {
  try {
    const resposta = await fetch(API_URL, {
      credentials: 'include'
    });

    if (resposta.status === 401) {
      window.location.replace('login.html');
      return;
    }

    if (!resposta.ok) {
      throw new Error(
        await obterMensagemErro(
          resposta,
          'Não foi possível carregar as atividades.'
        )
      );
    }

    const atividades = await resposta.json();

    renderizarAtividades(atividades);
    atualizarResumo(atividades);
  } catch (error) {
    console.error('Erro ao carregar atividades:', error);

    mostrarMensagem(error.message, 'error');
  }
}

/* ===============================
   CRIAR E ATUALIZAR
================================ */

async function salvarAtividade(event) {
  event.preventDefault();

  limparMensagem();

  const id = idInput.value;

  const payload = {
    titulo: tituloInput.value.trim(),
    disciplina: disciplinaInput.value.trim(),
    categoria: categoriaInput.value,
    prioridade: prioridadeInput.value,
    prazo: prazoInput.value,
    status: statusInput.value,
    descricao: descricaoInput.value.trim()
  };

  const metodo = id ? 'PUT' : 'POST';
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      credentials: 'include'
    });

    if (resposta.status === 401) {
      window.location.replace('login.html');
      return;
    }

    if (!resposta.ok) {
      throw new Error(
        await obterMensagemErro(
          resposta,
          'Não foi possível salvar a atividade.'
        )
      );
    }

    mostrarMensagem(
      id
        ? 'Atividade atualizada com sucesso.'
        : 'Atividade cadastrada com sucesso.'
    );

    limparFormulario();
    await carregarAtividades();
  } catch (error) {
    console.error('Erro ao salvar atividade:', error);

    mostrarMensagem(error.message, 'error');
  }
}

/* ===============================
   EDITAR ATIVIDADE
================================ */

async function editarAtividade(id) {
  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      credentials: 'include'
    });

    if (resposta.status === 401) {
      window.location.replace('login.html');
      return;
    }

    if (!resposta.ok) {
      throw new Error(
        await obterMensagemErro(
          resposta,
          'Não foi possível carregar a atividade.'
        )
      );
    }

    const atividade = await resposta.json();

    idInput.value = atividade.id;
    tituloInput.value = atividade.titulo;
    disciplinaInput.value = atividade.disciplina;
    categoriaInput.value = atividade.categoria;
    prioridadeInput.value = atividade.prioridade;
    prazoInput.value = String(atividade.prazo).slice(0, 10);
    statusInput.value = atividade.status;
    descricaoInput.value = atividade.descricao || '';

    formTitle.textContent = 'Editar atividade';
    salvarBtn.textContent = 'Atualizar atividade';
    cancelarEdicaoBtn.hidden = false;

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  } catch (error) {
    console.error('Erro ao editar atividade:', error);

    mostrarMensagem(error.message, 'error');
  }
}

/* ===============================
   EXCLUIR ATIVIDADE
================================ */

async function excluirAtividade(id) {
  const confirmar = window.confirm(
    'Deseja realmente excluir esta atividade?'
  );

  if (!confirmar) {
    return;
  }

  try {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (resposta.status === 401) {
      window.location.replace('login.html');
      return;
    }

    if (!resposta.ok) {
      throw new Error(
        await obterMensagemErro(
          resposta,
          'Não foi possível excluir a atividade.'
        )
      );
    }

    mostrarMensagem('Atividade excluída com sucesso.');

    await carregarAtividades();
  } catch (error) {
    console.error('Erro ao excluir atividade:', error);

    mostrarMensagem(error.message, 'error');
  }
}

/* ===============================
   LOGOUT
================================ */

async function fazerLogout() {
  logoutBtn.disabled = true;
  logoutBtn.textContent = 'Saindo...';

  try {
    const resposta = await fetch(`${AUTH_URL}/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!resposta.ok) {
      throw new Error('Não foi possível encerrar a sessão.');
    }

    window.location.replace('login.html');
  } catch (error) {
    console.error('Erro ao realizar logout:', error);

    logoutBtn.disabled = false;
    logoutBtn.textContent = 'Sair';

    alert('Não foi possível encerrar a sessão. Tente novamente.');
  }
}

/* ===============================
   EVENTOS
================================ */

form.addEventListener('submit', salvarAtividade);

cancelarEdicaoBtn.addEventListener('click', () => {
  limparFormulario();
  mostrarMensagem('Edição cancelada.');
});

logoutBtn.addEventListener('click', fazerLogout);

tabela.addEventListener('click', (event) => {
  const botao = event.target.closest('button[data-action]');

  if (!botao) {
    return;
  }

  const id = botao.dataset.id;

  if (botao.dataset.action === 'editar') {
    editarAtividade(id);
  }

  if (botao.dataset.action === 'excluir') {
    excluirAtividade(id);
  }
});

/* ===============================
   INICIALIZAÇÃO
================================ */

limparFormulario();
carregarAtividades();
