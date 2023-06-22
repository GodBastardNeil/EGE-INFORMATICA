const {Test, Task_List, Test_List, Task, Student} = require('../models/models');
const sequelize = require('../database');
const ApiError = require('../error/ApiError');

class testController
{
    async getTest(req, res, next)
    {
        const {id} = req.params;
        console.log('server-getTest ', id);
        
        const test = (await sequelize.query(
            `SELECT tl."testId", tl."taskId", t.right_answer, t.text
                FROM task_list as tl
                JOIN task as t ON t.id = tl."taskId"
                WHERE tl."testId"=${id}`
        ))[0];
        console.log(test);
        return res.json(test);
    }
    async getTestStat(req, res, next)
    {
        const {testId, studentId} = req.params;
        console.log('server-getTestStat ', testId, studentId);
        
        const test = await Test_List.findAll({
            attributes: ['scores', 'dates', 'answers'],
            where: { 'testId': testId, 'studentId': studentId }
        });

        console.log(test);
        return res.json(test);
    }
    async setTest(req, res, next)
    {
        const {id, ans, score, testId} = req.body;
        console.log('server-setTest ', id, ans, score, testId);
        const tl = await Test_List.update(
            {
                'scores': sequelize.fn('array_append', sequelize.col('scores'), score),
                'answers': sequelize.fn('array_append', sequelize.col('answers'), JSON.stringify(ans)),
                'dates': sequelize.fn('array_append', sequelize.col('dates'), sequelize.fn('NOW'))
            },
            {
                where:
                {
                    'testId': testId,
                    'studentId': id
                },
                individualHooks: true
            }
        ).catch(error => { console.log(error); });
        console.log('tl ', tl);
    }
}

module.exports = new testController();
