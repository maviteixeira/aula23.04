const service = require('../services/atividadesServices');

const categoriasPermitidas = [
  'Prova',
  'Trabalho',
  'Leitura',
  'Projeto',
  'Relatório',
  'Outro'
];

const prioridadesPermitidas = [
  'Baixa',
  'Média',
  'Alta'
];

const statusPermitidos = [
  'Pendente',
  'Em andamento',
  'Concluída'
];

function textoSeguro(valor) {
  return typeof valor === 'string' ? valor.trim() : '';
}

function normalizarAtividade(body) {
  return {
    titulo: textoSeguro(body.titulo),
    disciplina: textoSeguro(body.disciplina),
    categoria: textoSeguro(body.categoria),
    prioridade: textoSeguro(body.prioridade),
    prazo: textoSeguro(body.prazo),
    status: textoSeguro(body.status),
    descricao: textoSeguro(body.descricao) || null
  };
}

function dataValida(prazo) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(prazo)) {
    return false;
  }

  const data = new Date(`${prazo}T00:00:00`);

  return (
    !Number.isNaN(data.getTime()) &&
    data.toISOString().slice(0, 10) === prazo
  );
}

function validarAtividade(atividade) {
  const {
    titulo,
    disciplina,
    categoria,
    prioridade,
    prazo,
    status,
    descricao
  } = atividade;

  if (!titulo || !disciplina || !categoria || !prioridade || !prazo || !status) {
    return 'Preencha todos os campos obrigatórios.';
  }

  if (titulo.length > 120) {
    return 'O título deve ter no máximo 120 caracteres.';
  }

  if (disciplina.length > 100) {
    return 'A disciplina deve ter no máximo 100 caracteres.';
  }

  if (descricao && descricao.length > 500) {
    return 'A descrição deve ter no máximo 500 caracteres.';
  }

  if (!categoriasPermitidas.includes(categoria)) {
    return 'Categoria inválida.';
  }

  if (!prioridadesPermitidas.includes(prioridade)) {
    return 'Prioridade inválida.';
  }

  if (!statusPermitidos.includes(status)) {
    return 'Status inválido.';
  }

  if (!dataValida(prazo)) {
    return 'Prazo inválido.';
  }

  return null;
}

async function listar(req, res) {
  try {
    const atividades = await service.listar();

    return res.json(atividades);
  } catch (error) {
    console.error('Erro ao listar atividades:', error);

    return res.status(500).json({
      erro: 'Não foi possível listar as atividades.'
    });
  }
}

async function buscarPorId(req, res) {
  try {
    const atividade = await service.buscarPorId(req.params.id);

    if (!atividade) {
      return res.status(404).json({
        erro: 'Atividade não encontrada.'
      });
    }

    return res.json(atividade);
  } catch (error) {
    console.error('Erro ao buscar atividade:', error);

    return res.status(500).json({
      erro: 'Não foi possível buscar a atividade.'
    });
  }
}

async function criar(req, res) {
  try {
    const atividade = normalizarAtividade(req.body);
    const erroValidacao = validarAtividade(atividade);

    if (erroValidacao) {
      return res.status(400).json({
        erro: erroValidacao
      });
    }

    const atividadeCriada = await service.criar(atividade);

    return res.status(201).json(atividadeCriada);
  } catch (error) {
    console.error('Erro ao criar atividade:', error);

    return res.status(500).json({
      erro: 'Não foi possível criar a atividade.'
    });
  }
}

async function atualizar(req, res) {
  try {
    const atividade = normalizarAtividade(req.body);
    const erroValidacao = validarAtividade(atividade);

    if (erroValidacao) {
      return res.status(400).json({
        erro: erroValidacao
      });
    }

    const atividadeAtualizada = await service.atualizar(
      req.params.id,
      atividade
    );

    if (!atividadeAtualizada) {
      return res.status(404).json({
        erro: 'Atividade não encontrada.'
      });
    }

    return res.json(atividadeAtualizada);
  } catch (error) {
    console.error('Erro ao atualizar atividade:', error);

    return res.status(500).json({
      erro: 'Não foi possível atualizar a atividade.'
    });
  }
}

async function remover(req, res) {
  try {
    const removido = await service.remover(req.params.id);

    if (!removido) {
      return res.status(404).json({
        erro: 'Atividade não encontrada.'
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao remover atividade:', error);

    return res.status(500).json({
      erro: 'Não foi possível remover a atividade.'
    });
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};