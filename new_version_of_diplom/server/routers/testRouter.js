const Router = require('express');
const router = new Router();
const testController = require('../controllers/testController');

const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/:id', checkRole(2), testController.getTest);
router.get('/:testId/:studentId', testController.getTestStat);

router.post('/', checkRole(2), testController.setTest);

module.exports = router;
