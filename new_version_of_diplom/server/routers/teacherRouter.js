const Router = require('express');
const router = new Router();
const teacherController = require('../controllers/teacherController');
const checkRole = require('../middleware/checkRoleMiddleware'); 

router.get('/statinfo/:id', checkRole(3), teacherController.getForStat);
router.get('/classinfo/:id', checkRole(3), teacherController.getStudents);

module.exports = router;
