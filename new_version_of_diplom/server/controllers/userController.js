const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
const {User, Role, Student, Teacher} = require('../models/models');

const generateJwt = (id, login, roleId) => {
    return jwt.sign(
        {id, login, roleId},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    );
}

class UserController
{
    async registration(req, res, next)
    {
        const {login, password, roleId} = req.body;

        console.log('server-registration ', login, password, roleId);

        if (!login || !password) { return next(ApiError.badRequest('Некорректный login или password')); }

        const candidate = await User.findOne({ where: {'login': login} });
        if (candidate) { return next(ApiError.badRequest('Пользователь с таким login уже существует')); }

        const hashPassword = await bcrypt.hash(password, 5);
        const user = await User.create({'login': login, 'password': hashPassword, 'roleId': roleId});
        
        const token = generateJwt(user.id, user.login, roleId);

        return res.json({token});
    }

    async login(req, res, next)
    {
        const {login, password, roleId} = req.body;
        console.log('server-login ', login, password, roleId);
        
        if (!login || !password) { return next(ApiError.badRequest('Некорректный login или password')); }
        
        let user = await User.findOne({ where: {'login': login, 'roleId': roleId} });
        if (!user) { return next(ApiError.internal('Пользователь не найден')); }
        
        let comparePassword = bcrypt.compareSync(password, user.password);
        if (!comparePassword) { return next(ApiError.internal('Указан неверный пароль')); }

        const token = generateJwt(user.id, user.login, roleId);
        return res.json({token});
    }
    async getRoles(req, res, next)
    {
        const roles = await Role.findAll({
            attributes: ['id', 'name'],
            where: {'name': {[Op.ne]: 'admin'}}
        });
        return res.json(roles);
    }
    async check(req, res, next)
    {
        const token = generateJwt(req.user.id, req.user.login, req.user.roleId);
        return res.json({token});
    }
}

module.exports = new UserController();
