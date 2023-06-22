const Router = require('express');
const router = new Router();
const templateController = require('../controllers/templateController');
const checkRole = require('../middleware/checkRoleMiddleware');

// не должно быть проверки на роль
router.get('/:id', checkRole(1), templateController.getTemplate);

router.post('/text', checkRole(1), templateController.setText);
router.post('/inputs', checkRole(1), templateController.setInputs);


module.exports = router;