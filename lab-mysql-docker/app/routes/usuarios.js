const express = require('express');
const controller = require('../controllers/usuariosControllers');
const exigirLogin = require('../middlewares/auth');

const router = express.Router();

router.use(exigirLogin);


router.get('/', controller.listar);
router.get('/:id', controller.buscarPorId);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.remover);

module.exports = router;