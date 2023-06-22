const {User, Class} = require('../models/models');
const ApiError = require('../error/ApiError');
const sequelize = require('../database');
const {Op} = require('sequelize');

class TeacherClassController
{
    async deleteClass(req, res, next)
    {
        const {id, rowKey} = req.body;
        console.log('server-deleteClass', id, rowKey);
        Class.destroy({
            where: {
                teacherId: id,
                studentId: rowKey
            }
        });
    }
    async addClass(req, res, next)
    {
        const {id, rowKey} = req.body;
        console.log('server-addClass', id, rowKey);
        Class.update(
            { active: true },
            { where: {
                studentId: rowKey,
                teacherId: id
            }}
        );
    }

    async getClassStudents(req, res, next)
    {
        const {id} = req.params;
        console.log('server-getClassStudents', id);

        try {
            const classStudent = await User.findAll({
                attributes: ['id', 'login'],
                where:
                {
                    'id':
                    {
                        [Op.in]: sequelize.literal(`(${
                                    sequelize.dialect.queryGenerator.selectQuery('class', {
                                        attributes: ['studentId'],
                                        where: { 'teacherId': id, 'active': true }
                                    }).slice(0, -1)
                                })`)
                    }
                }
            });
            console.log(classStudent);
            return res.json(classStudent);
        } catch (error) { console.log(error); }
    }
    async getRequestStudents(req, res, next)
    {
        const {id} = req.params;
        console.log('server-getRequestStudents', id);

        try {
            const requestStudent = await User.findAll({
                attributes: ['id', 'login'],
                where:
                {
                    'id':
                    {
                        [Op.in]: sequelize.literal(`(${
                                    sequelize.dialect.queryGenerator.selectQuery('class', {
                                        attributes: ['studentId'],
                                        where: { 'teacherId': id, 'active': false }
                                    }).slice(0, -1)
                                })`)
                    }
                }
            });
            console.log(requestStudent);
            return res.json(requestStudent);
        } catch (error) { console.log(error); }
    }

    async getStudents(req, res, next)
    {
        const {id} = req.params;
        console.log('server-getStudents', id);
        let students = [2];
        
        students[0] = await User.findAll({
            attributes: ['id', 'login'],
            where:
            {
                'id':
                {
                    [Op.in]: sequelize.literal(`(${
                                sequelize.dialect.queryGenerator.selectQuery('class', {
                                    attributes: ['studentId'],
                                    where: { 'teacherId': id, 'active': true }
                                }).slice(0, -1)
                            })`)
                }
            }
        });
        students[1] = await User.findAll({
            attributes: ['id', 'login'],
            where:
            {
                'id':
                {
                    [Op.in]: sequelize.literal(`(${
                                sequelize.dialect.queryGenerator.selectQuery('class', {
                                    attributes: ['studentId'],
                                    where: { 'teacherId': id, 'active': false }
                                }).slice(0, -1)
                            })`)
                }
            }
        });
        
        return res.json(students);
    }
}

module.exports = new TeacherClassController();
