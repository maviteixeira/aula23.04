const db = require('../db');

async function listar() {
  const [rows] = await db.query(`
    SELECT
      id,
      titulo,
      disciplina,
      categoria,
      prioridade,
      prazo,
      status,
      descricao,
      created_at,
      updated_at
    FROM atividades
    ORDER BY prazo ASC, id DESC
  `);

  return rows;
}

async function buscarPorId(id) {
  const [rows] = await db.query(
    `
      SELECT
        id,
        titulo,
        disciplina,
        categoria,
        prioridade,
        prazo,
        status,
        descricao,
        created_at,
        updated_at
      FROM atividades
      WHERE id = ?
    `,
    [id]
  );

  return rows[0] || null;
}

async function criar({
  titulo,
  disciplina,
  categoria,
  prioridade,
  prazo,
  status,
  descricao
}) {
  const [result] = await db.query(
    `
      INSERT INTO atividades (
        titulo,
        disciplina,
        categoria,
        prioridade,
        prazo,
        status,
        descricao
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      titulo,
      disciplina,
      categoria,
      prioridade,
      prazo,
      status,
      descricao
    ]
  );

  return buscarPorId(result.insertId);
}

async function atualizar(
  id,
  {
    titulo,
    disciplina,
    categoria,
    prioridade,
    prazo,
    status,
    descricao
  }
) {
  const [result] = await db.query(
    `
      UPDATE atividades
      SET
        titulo = ?,
        disciplina = ?,
        categoria = ?,
        prioridade = ?,
        prazo = ?,
        status = ?,
        descricao = ?
      WHERE id = ?
    `,
    [
      titulo,
      disciplina,
      categoria,
      prioridade,
      prazo,
      status,
      descricao,
      id
    ]
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return buscarPorId(id);
}

async function remover(id) {
  const [result] = await db.query(
    'DELETE FROM atividades WHERE id = ?',
    [id]
  );

  return result.affectedRows > 0;
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};