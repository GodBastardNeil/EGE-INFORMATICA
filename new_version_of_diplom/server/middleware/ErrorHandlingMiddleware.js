const ApiError = require('../error/ApiError');

module.exports = function (err, req, res, next)
{
    console.log('ApiError', err.status, err.message)
    if (err instanceof ApiError)
    {
        return res.status(err.status).json({message: err.message})
    }
    return res.status(69).json({message: "Непредвиденная ошибка!"})
}
