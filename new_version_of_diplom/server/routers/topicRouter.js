const Router = require('express');
const router = new Router();
const topicController = require('../controllers/topicController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/', topicController.getAll);
router.post('/', topicController.CreateTask);

router.post('/blank', topicController.CreateBlankTest);


module.exports = router;
