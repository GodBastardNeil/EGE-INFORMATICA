const {Topic, Type, Template, Test, Task, Task_List, Test_List, Stat} = require('../models/models');
const sequelize = require('../database');
const ApiError = require('../error/ApiError');
let genHandle = require(`./exersize_tmp/ex_prt.js`);

class TopicController
{
    async getAll(req, res, next)
    {
        const topic = await Topic.findAll({
            where: { active: true },
            include:[
                {
                    model: Type,
                    attributes: ['id', 'title'],
                    where: { active: true },
                    required: false
                }
            ]
        });
        return res.json(topic);
    }
    async getTheory(req, res, next)
    {
        const {id} = req.params;
        const topic = await Topic.findByPk(id);
        const docPath = path.join(__dirname, `exersize_tmp/theory/${topic.dataValues.id}.docx`);
        
        res.download(docPath, `${topic.dataValues.id}.docx`, err => { if (err) { throw err; } });
    }

    async CreateTask(req, res, next)
    {
        const {testid, typeid, kol} = req.body;
        console.log('server-CreateTask ', testid, typeid, kol);
        let tmp_text = ''
        if (kol > 0)
        {
            let temp = await Template.findAll({ where: { typeId: typeid, active: true } });
            for (let i=0; i<kol; ++i)
            {
                let j = Math.floor(Math.random() * temp.length);
                let gen;
                //constructor(t, cal, bords = [], lists = [], functs = [], codes = [], mases = [], docFN = [], LogFT = [])
                gen = new genHandle(temp[j].text, temp[j].ans,
                                    temp[j].rand, temp[j].word,
                                    temp[j].comp, temp[j].code,
                                    temp[j].masRL, temp[j].docFN,temp[j].logFT);
                console.log(`genHandle`);
                gen.create_ex();

                Task.findOrCreate({
                    where: { 'text': gen.return_text() },
                    defaults:
                    {
                        'right_answer': gen.return_res(),
                        'text': gen.return_text(),
                        'templateId': temp[j].id,
                        'max_score': 1
                    }
                }).then(task => {
                    console.log(`Task_List`, task[0].dataValues.id, testid);
                    Task_List.create({taskId: task[0].dataValues.id, testId: testid})
                }).catch(error => { console.log('error', error); });
            }
            await Test.update( { 'active': true}, { where: { 'testId': testid }, individualHooks: true } );
        }
    }
    // ?
    async CreateBlankTest(req, res, next)
    {
        const {id, studlist} = req.body;

        Test.create({'testTypeId': 1, 'userId': id, 'active': false}).then(test => {
            studlist.forEach((studId) => {
                Test_List.create({studentId: studId, testId: test.id});
            });
            console.log(test, test.id)
            return res.json(test.id);
        });
    }


}



module.exports = new TopicController();
