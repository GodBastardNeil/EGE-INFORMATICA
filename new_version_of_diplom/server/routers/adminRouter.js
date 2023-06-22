const Router = require('express');
const router = new Router();
const adminController = require('../controllers/adminController');
const checkRole = require('../middleware/checkRoleMiddleware');


router.post('/topic/:id', checkRole(1), adminController.Reset);

router.get('/topic', checkRole(1), adminController.getTopic);
router.post('/SaveTopic', checkRole(1), adminController.SaveTopic);
router.post('/ChangeTopic', checkRole(1), adminController.ChangeTopic);
router.post('/ActiveTopic', checkRole(1), adminController.ActiveTopic);


router.get('/type/:id', checkRole(1), adminController.getType);
router.post('/SaveType', checkRole(1), adminController.SaveType);
router.post('/ChangeType', checkRole(1), adminController.ChangeType);
router.post('/ActiveType', checkRole(1), adminController.ActiveType);


router.get('/template/:id', checkRole(1), adminController.getTemplate);
router.get('/template/topicId/:id', checkRole(1), adminController.getTopicId);
router.post('/ActiveTemplate', checkRole(1), adminController.ActiveTemplate);



module.exports = router;