const {User, Class} = require('../models/models');
const ApiError = require('../error/ApiError');
const sequelize = require('../database');
const {Op} = require('sequelize');

const subClassTeachList = sequelize.dialect.queryGenerator.selectQuery('class', {
    attributes: ['teacherId'],
    where: { 'studentId': id, 'active': true }
}).slice(0, -1);
const subReqTeachList = sequelize.dialect.queryGenerator.selectQuery('class', {
    attributes: ['teacherId'],
    where: { 'studentId': id, 'active': false }
}).slice(0, -1)

const subAllTeach = sequelize.dialect.queryGenerator.selectQuery('teacher', {
    attributes: ['id']
}).slice(0, -1)
const subAllClassTeach = sequelize.dialect.queryGenerator.selectQuery('class', {
    attributes: ['teacherId'],
    where: { 'studentId': id }
}).slice(0, -1)


class StudentClassController
{
    async deleteClass(req, res, next)
    {
        const {id, rowKey} = req.body;
        console.log('server-deleteClass', id, rowKey);
        Class.destroy({
            where: {
                'studentId': id,
                'teacherId': rowKey
            }
        });
    }
    async addRequest(req, res, next)
    {
        const {id, rowKey} = req.body;
        console.log('server-addRequest', id, rowKey);
        Class.create({'teacherId': rowKey, 'studentId': id, 'active': false});
    }

    async getClassTeachers(req, res, next)
    {
        const {id} = req.params;
        console.log('server-getClassTeachers', id);

        try {
            const classTeachers = await User.findAll({
                attributes: ['id', 'login'],
                where:
                {
                    'id': { [Op.in]: sequelize.literal(`(${subClassTeachList})`) }
                }
            });
            console.log(classTeachers);
            return res.json(classTeachers);
        } catch (error) { console.log(error); }
    }
    async getRequestTeachers(req, res, next)
    {
        const {id} = req.params;
        console.log('server-getRequestTeachers', id);

        try {
            const requestTeachers = await User.findAll({
                attributes: ['id', 'login'],
                where:
                {
                    'id': { [Op.in]: sequelize.literal(`(${subReqTeachList})`) }
                }
            });
            console.log(requestTeachers);
            return res.json(requestTeachers);
        } catch (error) { console.log(error); }
    }
    async getFreeTeachers(req, res, next)
    {
        const {id} = req.params;
        console.log('server-getFreeTeachers', id);

        try {
            const freeTeachers = await User.findAll({
                attributes: ['id', 'login'],
                where:
                {
                    'id':
                    {
                        [Op.in]: sequelize.literal(`(${subAllTeach})`),
                        [Op.notIn]: sequelize.literal(`(${subAllClassTeach})`)
                    }
                }
            });
            console.log(freeTeachers);
            return res.json(freeTeachers);
        } catch (error) { console.log(error); }
    }

    async getTeachers(req, res, next)
    {
        const {id} = req.params;
        console.log('server-getTeachers', id);

        let teachers = [3];
        try {
            teachers[0] = await User.findAll({
                attributes: ['id', 'login'],
                where:
                {
                    'id': { [Op.in]: sequelize.literal(`(${subClassTeachList})`) }
                }
            });
            teachers[1] = await User.findAll({
                attributes: ['id', 'login'],
                where:
                {
                    'id': { [Op.in]: sequelize.literal(`(${subReqTeachList})`) }
                }
            });
            teachers[2] = await User.findAll({
                attributes: ['id', 'login'],
                where:
                {
                    'id':
                    {
                        [Op.in]: sequelize.literal(`(${subAllTeach})`),
                        [Op.notIn]: sequelize.literal(`(${subAllClassTeach})`)
                    }
                }
            });

            return res.json(teachers);
        } catch (error) { console.log(error); }
    }
}


module.exports = new StudentClassController();