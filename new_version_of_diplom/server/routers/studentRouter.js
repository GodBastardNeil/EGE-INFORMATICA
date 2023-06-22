const Router = require('express');
const router = new Router();
const studentController = require('../controllers/studentController');
const checkRole = require('../middleware/checkRoleMiddleware');

// не должно быть проверки на роль
router.get('/main/:id', studentController.getMainStat);
router.get('/teach/:id', studentController.getTeacherTests);
router.get('/test/:id', studentController.getTestStat);
router.get('/topic/:id', studentController.getTopicStat);

module.exports = router;
