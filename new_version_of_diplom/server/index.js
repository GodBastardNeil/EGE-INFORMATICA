require('dotenv').config();

const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bp = require('body-parser')

const path = require('path');

const sequelize = require('./database');
//const models = require('./models/models');
const router = require('./routers/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');


const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(bp.json()); // для парсинга json;
app.use(bp.urlencoded({ extended: false }))
//app.use(express.json()); // для парсинга json
app.use(express.static(path.resolve(__dirname, 'static')));
app.use(fileUpload({}));
app.use('/api', router);

app.use(errorHandler); // Обработка ошибок, последний Middleware


const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e)
    }
}


start();