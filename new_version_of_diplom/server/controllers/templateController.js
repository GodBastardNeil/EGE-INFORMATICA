const {Template} = require('../models/models');
const ApiError = require('../error/ApiError');
let genHandle = require(`./exersize_tmp/ex_prt.js`);
var fs = require('fs');


class TemplateController
{
    async getTemplate(req, res, next)
    {
        const {id} = req.params;
        console.log('getTemplate', id);
        Template.findByPk(id).then(template =>  {return res.json(template);});
    }

    async setText(req, res, next)
    {
        const {id, typeId, text, ans,
                rand, word, comp, code,
                masRL, docFN, logFT} = req.body;
        console.log('server-setText ', id, typeId, text, ans,
                                        rand, word, comp, code,
                                        masRL, docFN, logFT);
        try {
            
            let temp = await Template.findOrCreate({ where: {'id': id}, defaults: { 'id': 13, 'typeId': typeId, 'ans': ans, 'text': text, 'active': false } });
            temp[0].dataValues.text = text;
            temp[0].dataValues.ans = ans;
            temp[0].dataValues.active = false;
            let n = temp[0].dataValues.word.length;
            for (let i=0; i<(word.length-n); ++i) { temp[0].dataValues.word.push(''); }
            for (let i=0; i<(n-word.length); ++i) { temp[0].dataValues.word.pop(); }

            n = temp[0].dataValues.code.length;
            for (let i=0; i<(code.length-n); ++i) { temp[0].dataValues.code.push(''); }
            for (let i=0; i<(n-code.length); ++i) { temp[0].dataValues.code.pop(); }

            n = temp[0].dataValues.comp.length;
            for (let i=0; i<(comp.length-n); ++i) { temp[0].dataValues.comp.push(''); }
            for (let i=0; i<(n-comp.length); ++i) { temp[0].dataValues.comp.pop(); }

            n = temp[0].dataValues.rand.length;
            for (let i=0; i<(rand.length-n); ++i) { temp[0].dataValues.rand.push(rand[0]); }
            for (let i=0; i<(n-rand.length); ++i) { temp[0].dataValues.rand.pop(); }

            n = temp[0].dataValues.masRL.length;
            for (let i=0; i<(masRL.length-n.length); ++i) { temp[0].dataValues.masRL.push(masRL[0]); }
            for (let i=0; i<(n-masRL.length); ++i) { temp[0].dataValues.masRL.pop(); }

            n = temp[0].dataValues.docFN.length;
            for (let i=0; i<(docFN.length-n); ++i) { temp[0].dataValues.docFN.push(docFN[0]); }
            for (let i=0; i<(n-docFN.length); ++i)
            {
                let list = temp[0].dataValues.docFN[temp[0].dataValues.docFN.length-1]['file'].split(',');
                for (let j=0; j<list.length; ++j)
                {
                    fs.unlink(`./exersize_tmp/doc/${list[j]}`, (err) => {
                        if (err) { throw err; }
                        console.log("File is deleted.");
                    });
                }
                temp[0].dataValues.docFN.pop();
            }
            temp[0].dataValues.logFT = logFT;

            await Template.update({
                'text': temp[0].dataValues.text,
                'ans': temp[0].dataValues.ans,
                'word': temp[0].dataValues.word,
                'rand': temp[0].dataValues.rand,
                'code': temp[0].dataValues.code,
                'masRL': temp[0].dataValues.masRL,
                'docFN': temp[0].dataValues.docFN,
                'logFT': temp[0].dataValues.logFT,
            }, { where: { 'id': temp[0].dataValues.id } })
            
            console.log('id', temp[0].dataValues.id);
            return res.json({'id': temp[0].dataValues.id});
        } catch (error) { console.log('error', error); return next(ApiError.forbidden(error.message)); }
    }
    async setInputs(req, res, next)
    {
        console.log('req- server-setInputs ', req);
        const {id, rand, word, comp, code,
                    masRL, logFT, docFN} = req.body;
        console.log('server-setInputs ', id, rand, word, comp, code,
                                                masRL, logFT, docFN);
        try {
            let temp = await Template.findByPk(id);
            temp.rand = rand;
            temp.word = word;
            temp.comp = comp;
            temp.code = code;
            temp.masRL = masRL;
            temp.logFT = logFT;
            
            if (req.files != null)
            {
                const {files} = req.files;
                for(let i=0; i<temp.docFN.length; ++i)
                {
                    let fil = { file: ``, isName: temp.docFN[i]['isName'], name: docFN[i] }
                    for(let j=0; j<files[`docF${i+1}`].length; ++j)
                    {
                        fil['name'] += files[`docF${i+1}`][j].name + ',';
                        if (temp.docFN[i]['name'].indexOf(files[`docF${i+1}`][j].name) == -1)
                        {
                            fs.writeFile(`./doc/${files[`docF${i+1}`][j].name}`, files[`docF${i+1}`][j].data, 'base64', function (err) {
                                if (err) return console.log(err);
                                console.log(`docF${i+1} saved`);
                            });
                        }
                    }
                    fil['name'].pop();
                    temp.docFN[i] = fil;
                }
            }
            let gen = new genHandle(temp.text, temp.ans, rand, word, comp, code,
                                                        masRL, docFN, logFT);

            await Template.update({
                'word': temp.word,
                'rand': temp.rand,
                'code': temp.code,
                'masRL': temp.masRL,
                'docFN': temp.docFN,
                'logFT': temp.logFT,
            }, { where: { 'id': temp.id } })
            console.log('id ', id);
            return res.json({'id': id});
        } catch (error) { return next(ApiError.forbidden(error.message)); }
    }
}



module.exports = new TemplateController();
