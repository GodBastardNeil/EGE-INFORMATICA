const {Topic, Type, Template, Stat} = require('../models/models');
const ApiError = require('../error/ApiError');
var fs = require('fs');

const activation = async(temp, active) => {
    try {
        await Template.update(
            { 'active': active,
                'word': temp.word,
                'rand': temp.rand,
                'code': temp.code,
                'masRL': temp.masRL,
                'docFN': temp.docFN,
                'logFT': temp.logFT, },
            {
                where: {'id': temp.id},
                individualHooks: true
            }
        );
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

class AdminController
{
    async setTheory(req, res, next)
    {
        const {myFile} = req.files;
        const {id} = req.params;
        
        const path = __dirname + `exersize_tmp/theory/${id}.docx`;

        myFile.mv(path, (error) => {
            if (error)
            {
                console.error(error);
                return next(ApiError.internal('Не может быть активирован, поскольку не имеет шаблонов'));
            }
        });
    }

    async getTopic(req, res, next)
    {
        let topics = [2];
        topics[0] = await Topic.findAll({ attributes: ['id', 'title'], where: { 'active': true } });
        topics[1] = await Topic.findAll({ attributes: ['id', 'title'], where: { 'active': false } });

        return res.json(topics);
    }
    async getType(req, res, next)
    {
        const {id} = req.params;
        let types = [2];
        types[0] = await Type.findAll({ attributes: ['id', 'title'], where: { 'topicId': id, 'active': true } });
        types[1] = await Type.findAll({ attributes: ['id', 'title'], where: { 'topicId': id, 'active': false } });

        return res.json(types);
    }
    async getTemplate(req, res, next)
    {
        const {id} = req.params;
        let templates = [2];
        templates[0] = await Template.findAll({ attributes: ['id'], where: { 'typeId': id, 'active': true } });
        templates[1] = await Template.findAll({ attributes: ['id'], where: { 'typeId': id, 'active': false } });
        
        return res.json(templates);
    }
    async getTopicId(req, res, next)
    {
        const {id} = req.params;
        let topicId = await Type.findOne({ attributes: ['topicId'], where: { 'id': id} });
        return res.json(topicId);
    }

    async Reset(req, res, next)
    {
        const {id} = req.params;
        Stat.update(
            { 'max_score': 0, 'user_score': 0, 'last_5': null },
            { where: { 'topicId': id } }
        );
    }


    async ActiveTopic(req, res, next)
    {
        const {id, active} = req.body;
        console.log('server-ActiveTopic', id, active);

        let n = 0;
        Type.findAll({where: {'topicId': id}}).then(types => {
            types.forEach(type => {
                Template.findAll({where: {'typeId': type.id}}).then(temps => {
                    temps.forEach(temp => {
                        if (activation(temp.dataValues, active)) { ++n; }
                    });
                });
            });
            if (n == 0) { return next(ApiError.internal('Не может быть активирован, поскольку не имеет шаблонов')); }
        });
    }
    async ActiveType(req, res, next)
    {
        const {id, active} = req.body;
        console.log('server-ActiveType', id, active);

        let n = 0;
        Template.findAll({where: {'typeId': id}}).then(temps => {
            temps.forEach(temp => {
                if (activation(temp.dataValues, active)) { ++n; }
            });
            if (n == 0) { return next(ApiError.internal('Не может быть активирован, поскольку не имеет шаблонов')); }
        });
    }
    async ActiveTemplate(req, res, next)
    {
        const {id, active} = req.body;
        console.log('server-ActiveTemplate', id, active);
        let temp = await Template.findByPk(id);
        console.log(temp);
        if (!(await activation(temp.dataValues, active))) { return next(ApiError.internal('Не может быть активирован шаблон не доделан')); }
        return true;
    }


    async SaveTopic(req, res, next)
    {
        const {id, title} = req.body;
        console.log('server-SaveTopic', id, title);
        try {
            Topic.create({'id': id, 'title': title, 'active': false});
        } catch (error) { return next(ApiError.internal('Название уже занято')); }
    }
    async ChangeTopic(req, res, next)
    {
        const {id, title} = req.body;
        console.log('server-ChangeTopic', id, title);
        try {
            Topic.update(
                { 'title': title },
                { where: {'id': id} }
            );
        } catch (error) { return next(ApiError.internal('Название уже занято')); }
    }

    async SaveType(req, res, next)
    {
        const {id, topicId, title} = req.body;
        console.log('server-SaveType', id, topicId, title);
        try {
            Type.create({'id': id, 'topicId': topicId, 'title': title, 'active': false});
        } catch (error) { return next(ApiError.internal('Название уже занято')); }
    }
    async ChangeType(req, res, next)
    {
        const {id, title} = req.body;
        console.log('server-ChangeType', id, title);
        try {
            Type.update(
                { 'title': title },
                { where: {'id': id} }
            );
        } catch (error) { return next(ApiError.internal('Название уже занято')); }
    }
}



module.exports = new AdminController();
