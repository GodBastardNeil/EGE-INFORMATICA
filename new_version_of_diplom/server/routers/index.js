const Router = require('express');
const router = new Router();

const userRouter = require('./userRouter');
const topicRouter = require('./topicRouter');
const testRouter = require('./testRouter');
const teacherRouter = require('./teacherRouter');
const studentRouter = require('./studentRouter');
const classRouter = require('./classRouter');
const adminRouter = require('./adminRouter');
const templateRouter = require('./templateRouter');


router.use('/user', userRouter);
router.use('/topic', topicRouter);
router.use('/test', testRouter);
router.use('/teacher', teacherRouter);
router.use('/student', studentRouter);
router.use('/class', classRouter);
router.use('/admin', adminRouter);
router.use('/template', templateRouter);


module.exports = router;
