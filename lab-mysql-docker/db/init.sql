DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS atividades;

CREATE TABLE atividades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(120) NOT NULL,
  disciplina VARCHAR(100) NOT NULL,
  categoria VARCHAR(30) NOT NULL,
  prioridade VARCHAR(10) NOT NULL,
  prazo DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Pendente',
  descricao VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO atividades (
  titulo,
  disciplina,
  categoria,
  prioridade,
  prazo,
  status,
  descricao
) VALUES
(
  'Revisar Árvores B',
  'Estrutura de Dados II',
  'Prova',
  'Alta',
  '2026-07-02',
  'Em andamento',
  'Revisar inserção, remoção e busca em árvores B.'
),
(
  'Finalizar atividade de Desenvolvimento Web',
  'Desenvolvimento Web',
  'Trabalho',
  'Alta',
  '2026-06-30',
  'Pendente',
  'Implementar o StudyFlow com Docker, Node.js e MySQL.'
),
(
  'Preparar relatório de monitoria',
  'Monitoria',
  'Relatório',
  'Média',
  '2026-07-05',
  'Pendente',
  'Organizar atividades desenvolvidas durante o mês.'
),
(
  'Estudar Docker Compose',
  'Desenvolvimento Web',
  'Leitura',
  'Média',
  '2026-06-29',
  'Concluída',
  'Revisar serviços, volumes, redes e comandos principais.'
);