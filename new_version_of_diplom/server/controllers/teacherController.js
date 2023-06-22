const {User, Class, Teacher, Stat} = require('../models/models');
const ApiError = require('../error/ApiError');
const sequelize = require('../database');
const {Op} = require('sequelize');

class TeacherController
{
    async getAll(req, res, next)
    {
        const teachers = await Teacher.findAll();
        return res.json(teachers);
    }

    async getForStat(req, res, next)
    {
        const {id} = req.params;
        console.log('server-getForStat ', id);

        const students = await User.findAll({
            attributes: ['id', 'login'],
            where:
            {
                id:
                {
                    [Op.in]: sequelize.literal(`(${
                                sequelize.dialect.queryGenerator.selectQuery('class', {
                                    attributes: ['studentId'],
                                    where: { teacherId: id, active: true }
                                }).slice(0, -1)
                            })`)
                }
            }
        });
        return res.json(students);
    }

    async getStudents(req, res, next)
    {
        const {id} = req.params;
        console.log('server-getStudents ',id);
        let students = [2];

        students[0] = await User.findAll({
            attributes: ['id', 'login'],
            where:
            {
                id:
                {
                    [Op.in]: sequelize.literal(`(${
                                sequelize.dialect.queryGenerator.selectQuery('class', {
                                    attributes: ['studentId'],
                                    where: { teacherId: id, active: true }
                                }).slice(0, -1)
                            })`)
                }
            }
        });
        students[1] = await User.findAll({
            attributes: ['id', 'login'],
            where:
            {
                id:
                {
                    [Op.in]: sequelize.literal(`(${
                                sequelize.dialect.queryGenerator.selectQuery('class', {
                                    attributes: ['studentId'],
                                    where: { teacherId: id, active: false }
                                }).slice(0, -1)
                            })`)
                }
            }
        });
        /*students[0] = (await sequelize.query(
            `SELECT user."id", user."login"
                FROM public.user
                WHERE user."id" IN
                    (SELECT class."studentId" FROM class WHERE class."teacherId"=${id} AND class."active"=true)`
        ))[0];
        students[1] = (await sequelize.query(
            `SELECT user."id", user."login"
                FROM public.user
                WHERE user."id" IN
                    (SELECT class."studentId" FROM class WHERE class."teacherId"=${id} AND class."active"=false)`
        ))[0];*/
        
        return res.json(students);
    }
}

module.exports = new TeacherController();
