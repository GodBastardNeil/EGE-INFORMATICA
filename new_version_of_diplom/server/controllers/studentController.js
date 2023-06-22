const {Student, Stat, Test_List, Test} = require('../models/models');
const sequelize = require('../database');
const {Op} = require('sequelize');

class StudentController
{
    async getTeacherTests(req, res, next)
    {
        const {id} = req.params;
        console.log('server-getTeacherTests '+id);
        
        const subTeachList = sequelize.dialect.queryGenerator.selectQuery('class', {
            attributes: ['teacherId'],
            where: { 'studentId': id, 'active': true }
        }).slice(0, -1);

        const tlist = await Test_List.findAll({
            attributes: ['scores', 'dates', 'studentId', 'testId'],
            where: {'studentId': id},
            include:
            [{
                model: Test,
                attributes: ['max_score', 'updatedAt'],
                where: //sequelize.literal(`"test"."userId" in (${subTeachList})`)
                {
                    'userId': { [Op.in]: sequelize.literal(`(${subTeachList})`) }
                }
            }]
        });
        
        /*const tlist = (await sequelize.query(
            `SELECT tl."scores", tl."dates", tl."studentId", tl."testId", t."max_score", t."updatedAt"
                FROM test_list as tl
                JOIN test as t ON t."id" = tl."testId" AND t."userId" in (select c."teacherId" from class as c where c."studentId"=${id} and c."active"=true)
                WHERE tl."studentId"=${id}
                ORDER BY t."updatedAt"`
        ))[0];*/
        return res.json(tlist);
    }
    async getTestStat(req, res, next)
    {
        const {id} = req.params;
        console.log('server-getTestStat '+id);

        const tlist = await Test_List.findAll({
            attributes: ['scores', 'dates', 'studentId', 'testId'],
            where: {'studentId': id},
            include:
            [{
                model: Test,
                attributes: ['max_score', 'updatedAt'],
                where: {'userId': id}
            }]
        });

        /*const tlist = (await sequelize.query(
            `SELECT tl."scores", tl."dates", tl."studentId", tl."testId", t."max_score", t."updatedAt"
                FROM test_list as tl
                JOIN test as t ON t."id" = tl."testId" AND t."userId"=${id}
                WHERE tl."studentId"=${id}
                ORDER BY t."updatedAt"`
        ))[0];*/
        return res.json(tlist);
    }

    async getTopicStat(req, res, next)
    {
        const {id} = req.params;
        console.log('server-getTopicStat '+id);
        
        const stat = await Stat.findAll({ where: { 'studentId': id, 'active': true } });
        return res.json(stat);
    }

    async getMainStat(req, res, next)
    {
        const {id} = req.params;
        console.log('server-getMainStat '+id);
        
        const main = await Student.findOne({ where: { 'id': id } });
        return res.json(main);
    }
}


module.exports = new StudentController();
