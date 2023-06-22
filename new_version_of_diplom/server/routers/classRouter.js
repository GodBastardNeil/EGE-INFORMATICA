const Router = require('express');
const router = new Router();
const StudentClassController = require('../controllers/studentclassController');
const TeacherClassController = require('../controllers/teacherclassController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.get('/classteachers/:id', checkRole(2), StudentClassController.getClassTeachers);
router.get('/requestteachers/:id', checkRole(2), StudentClassController.getRequestTeachers);
router.get('/freeteachers/:id', checkRole(2), StudentClassController.getFreeTeachers);

router.get('/teachers/:id', checkRole(2), StudentClassController.getTeachers);


router.post('/teacher/deleteclass', checkRole(2), StudentClassController.deleteClass);
router.post('/addrequest', checkRole(2), StudentClassController.addRequest);




router.get('/classstudent/:id', checkRole(3), TeacherClassController.getClassStudents);
router.get('/requeststudent/:id', checkRole(3), TeacherClassController.getRequestStudents);

router.get('/students/:id', checkRole(3), TeacherClassController.getStudents);


router.post('/student/deleteclass', checkRole(3), TeacherClassController.deleteClass);
router.post('/addclass', checkRole(3), TeacherClassController.addClass);


module.exports = router;