const officeParser = require("officeparser");
const repTags = (text, tag, num, n, bm = false, sub='') => {
    for (let i=0; i<n; ++i)
    {
        if (bm)
        {
            let matr = `[`;
            for (let i_i=0; i_i<num[i].length; ++i_i)
            {
                matr += `[` + num[i][i_i] + `],`;
            }
            matr = matr.slice(0, -1)
            matr += `]`;
            while(text.indexOf(`${tag}${i+1}$`) != -1) { text = text.replace(`${tag}${i+1}$`, `(${matr})`); }
        } else if (sub != '')
        {
            while(text.indexOf(`${tag}${i+1}$`) != -1) { text = text.replace(`${tag}${i+1}$`, num[i][sub]); }
        } else
        {
            while(text.indexOf(`${tag}${i+1}$`) != -1) { text = text.replace(`${tag}${i+1}$`, num[i]); }
        }
    }
    return text;
}

const randMas = (array) => {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0)
    {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
}
const randIn = (min, max) => { return (Math.floor(Math.random()*(max - min)) + min); }

const randWord = (list) => {
    let l = list.split(',');
    let n = l.length;

    return l[randIn(0, n)];
}

const createLog = (bo) => {
    let a = {text: '(', prog: '('};
    let text = ' ∧ ';
    let prog = ' && ';
    ['x', 'y', 'z'].forEach(lit => {
        if (bo || Math.floor(Math.random()*2) == 1)
        {
            if (Math.floor(Math.random()*2) == 1) { a['text'] += '¬'; a['prog'] += '!'; }
            a['text'] += lit + text;
            a['prog'] += lit + prog;
        }
    });
    if (a['text'].lastIndexOf(text)+text.length == a['text'].length)
    {
        a['text'] = a['text'].substr(0, a['text'].lastIndexOf(text));
        a['prog'] = a['prog'].substr(0, a['prog'].lastIndexOf(prog));
    }
    a['text'] += ')'; a['prog'] += ')';
    return a;
}

const toPascal = (code) => {
    let pascal = `var n, s: integer; \n begin \n ` + code;
    pascal = pascal.replaceAll('\n{', ''); pascal = pascal.replaceAll('{', '');

    pascal = pascal.replaceAll('\n}', '\n end;'); pascal = pascal.replaceAll('}', 'end;');
    
    pascal = pascal.replaceAll('let ', '');

    pascal = pascal.replaceAll(' = ', ' := ');
    pascal = pascal.replaceAll('s +=', 's := s + '); pascal = pascal.replaceAll('s+=', 's := s + ');
    pascal = pascal.replaceAll('s -=', 's := s - '); pascal = pascal.replaceAll('s-=', 's := s - ');
    pascal = pascal.replaceAll('s *=', 's := s * '); pascal = pascal.replaceAll('s*=', 's := s * ');

    pascal = pascal.replaceAll('n +=', 'n := n + '); pascal = pascal.replaceAll('n+=', 'n := n + ');
    pascal = pascal.replaceAll('n -=', 'n := n - '); pascal = pascal.replaceAll('n-=', 'n := n - ');
    pascal = pascal.replaceAll('n *=', 'n := n * '); pascal = pascal.replaceAll('n*=', 'n := n * ');


    pascal = pascal.replace('return ', 'write ');
    pascal += '); \n end.';

    return pascal;
}
const toAlg = (code) => {
    let alg = `алг \n нач \n цел n, s \n ` + code;
    alg = alg.replaceAll('\n{', ''); alg = alg.replaceAll('{', '');

    alg = alg.replaceAll('\n}', '\nкц'); alg = alg.replaceAll('}', 'кц');
    
    alg = alg.replaceAll(';', '');
    alg = alg.replaceAll('let ', '');

    alg = alg.replaceAll(' = ', ' := ');
    alg = alg.replaceAll('s +=', 's := s + '); alg = alg.replaceAll('s+=', 's := s + ');
    alg = alg.replaceAll('s -=', 's := s - '); alg = alg.replaceAll('s-=', 's := s - ');
    alg = alg.replaceAll('s *=', 's := s * '); alg = alg.replaceAll('s*=', 's := s * ');

    alg = alg.replaceAll('n +=', 'n := n + '); alg = alg.replaceAll('n+=', 'n := n + ');
    alg = alg.replaceAll('n -=', 'n := n - '); alg = alg.replaceAll('n-=', 'n := n - ');
    alg = alg.replaceAll('n *=', 'n := n * '); alg = alg.replaceAll('n*=', 'n := n * ');


    alg = alg.replace('while ', 'нц пока ');
    alg = alg.replace('return ', 'вывод ');
    alg += '\n кон';

    return alg;
}
const toBasic = (code) => {
    let basic = `DIM S, N AS INTEGER \n ` + code;
    basic = basic.replaceAll('\n{', ''); basic = basic.replaceAll('{', '');

    basic = basic.replaceAll('\n}', ''); basic = basic.replaceAll('}', '');
    
    basic = basic.replaceAll(';', '');
    basic = basic.replaceAll('let ', '');

    basic = basic.replaceAll('s +=', 's = s + '); basic = basic.replaceAll('s+=', 's = s + ');
    basic = basic.replaceAll('s -=', 's = s - '); basic = basic.replaceAll('s-=', 's = s - ');
    basic = basic.replaceAll('s *=', 's = s * '); basic = basic.replaceAll('s*=', 's = s * ');

    basic = basic.replaceAll('n +=', 'n = n + '); basic = basic.replaceAll('n+=', 'n = n + ');
    basic = basic.replaceAll('n -=', 'n = n - '); basic = basic.replaceAll('n-=', 'n = n - ');
    basic = basic.replaceAll('n *=', 'n = n * '); basic = basic.replaceAll('n*=', 'n = n * ');


    basic = basic.replace('while ', 'WHILE ');
    basic = basic.replace('return ', 'PRINT ');

    return basic;
}
const toCplus = (code) => {
    let Cplus = `#include <iostream> \n using namespace std; \n int main() \n { \n ` + code;
    Cplus = Cplus.replaceAll('let ', 'int ');
    Cplus = Cplus.replace('return ', 'cout << ');
    Cplus += ' \n return 0; \n }';

    return Cplus;
}
const toPython = (code) => {
    let python = code;
    python = python.replaceAll('\n{', ':'); python = python.replaceAll('{', ':');

    python = python.replaceAll('\n}', ''); python = python.replaceAll('}', '');
    
    python = python.replaceAll(';', '');
    python = python.replaceAll('let ', '');

    python = python.replace('return ', 'print(');
    python += ')';

    return python;
}

module.exports = class ex_prt {
    /*
rand, word, comp, code, masRL, docTN, logFT
    */
    constructor(t, cal, bords = [], lists = [], functs = [], codes = [], mases = [], docFN = [], LogFT = [])
    {
        try
        {
            this.tmp = t;
            this.text = t;

            this.res = '';
            this.fres = cal;

            this.rand = new Array();
            this.bord = bords;

            this.word = new Array();
            this.list = lists;

            this.masR = new Array();
            this.mas = mases;

            this.comp = new Array();
            this.funct = functs;
            
            this.logF = new Array();
            this.logT = new Array();
            this.logTable = new Array();
            this.LogFT = LogFT;

            this.codeTable = new Array();
            this.codeRes = new Array();
            this.code = codes;
            
            this.docF = new Array();
            this.docT = new Array();
            this.docN = new Array();
            this.docFN = docFN;
        } catch (error) { console.log('error', error.message); }
    }

    getValue(i, tag)
    {
        if (parseInt(this.bord[i][tag]) == NaN)
        { //text.substring(j, text.indexOf('$', j))
            return this.rand[this.bord[i][tag].substring('$rand'.length, text.indexOf('$', '$rand'.length))];
        } else { return parseInt(this.bord[i][tag]); }
    }
    
    fillRand()
    {
        let min;
        let max;
        for (let i=0; i<this.bord.length; ++i)
        {
            min = this.getValue(i, 'min');
            max = this.getValue(i, 'max');

            this.rand.push(randIn(min, max));
        }
    }
    fillWord()
    {
        for (let i=0; i<this.list.length; ++i)
        {
            this.word.push(randWord(this.list[i]));
            console.log(this.word);
        }
    }
    fillMasR()
    {
        for (let i=0; i<this.mas.length; ++i)
        { // join(','); 
            let list = randMas(this.mas[i]['mas'].split(','));

            let l = randIn(this.mas[i]['min'], this.mas[i]['max']);
            let m = list.slice(0, l);
            this.masR.push({mas: m, length: m.length});
            console.log(this.masR);
        }
    }
    fillDocx()
    {
        for (let i=0; i<this.docFN.length; ++i)
        {
            let list = this.docFN[i]['file'].split(',');
            let j = randIn(0, list.length);

            officeParser.parseOfficeAsync(`./doc/${list[j]}`, false).then((data) => {
                this.docT.push(data);
            });
            if (this.docFN[i]['isName']) { this.docN.push(this.docFN[i]['name'].split(',')[j]); }
            this.docF.push(`<Button onClick={() => getFile(${list[j]})}>${list[j]}</Button>`);
        }
    }

    fillLogF()
    {
        for (let i=0; i<this.LogFT.length; ++i)
        {
            let res = createLog(true);
            for (let j=0; j<2; ++j)
            {
                let tmp = createLog(false);
                if (tmp['text'] != "()")
                {
                    if (Math.floor(Math.random()*2) == 1)
                    {
                        res['text'] += ' V ' + tmp['text'];
                        res['prog'] += ' || ' + tmp['prog'];
                    } else
                    {
                        res['text'] = tmp['text'] + ' V ' + res['text'];
                        res['prog'] = tmp['prog'] + ' || ' + res['prog'];
                    }
                }
            }
            this.logF.push(res);
        }
    }
    fillLogT()
    {
        for (let i=0; i<this.LogFT.length; ++i)
        {
            this.logT.push(new Array());
            let f = Math.floor(Math.random()*2);

            let i_f = 3;
            let f_h = true;
            let p = [0, 1, 2];
            randMas(p);
            console.log(p);

            [1, 0].forEach(x => {
                [1, 0].forEach(y => {
                    [1, 0].forEach(z => {
                        if (this.LogFT[i]['all'] == 'true' || eval(`(x, y, z) => { return ${this.logF[i]['prog']}; }`)(x,y,z) == f)
                        {
                            let arr = [x, y, z, f];
                            this.logT[i].push([arr[p[0]], arr[p[1]], arr[p[2]], arr[i_f]]);
                        }
                    });
                });
            });
            if (this.LogFT[i]['show'] == 'true')
            {
                let r = `<table><tbody>
                    <tr>
                        <th style="text-align:center">Перем. 1</th>
                        <th style="text-align:center">Перем. 2</th>
                        <th style="text-align:center">Перем. 3</th>
                        <th style="text-align:center">Функция</th>
                    </tr>
                    <tr>
                        <td style="text-align:center">???</td>
                        <td style="text-align:center">???</td>
                        <td style="text-align:center">???</td>
                        <td style="text-align:center"><i>F</i></td>
                    </tr>`;
                for (let j=0; j<this.logT[i].length; ++j)
                {
                    let arr = []; arr.push(this.logT[i][j][0]); arr.push(this.logT[i][j][1]); arr.push(this.logT[i][j][2]); arr.push(this.logT[i][j][3]);
                    if (this.LogFT[i]['hidden'] == 'true')
                    {
                        if (f_h && Math.floor(Math.random()*2)) { arr[3] = ''; f_h = false; }

                        if (Math.floor(Math.random()*2)) { arr[Math.floor(Math.random()*3)] = ''; }
                        if (Math.floor(Math.random()*2)) { arr[Math.floor(Math.random()*3)] = ''; }
                    }
                    r += `<tr>
                            <td style="text-align:center">${arr[0]}</td>
                            <td style="text-align:center">${arr[1]}</td>
                            <td style="text-align:center">${arr[2]}</td>
                            <td style="text-align:center">${arr[3]}</td>
                        </tr>`
                }
                r += `</tbody></table>`;
                console.log('r', r)
                this.logTable.push(r);
            } else { this.logTable.push(''); }
        }
    }

    fillComp()
    {
        for (let i=0; i<this.funct.length; ++i)
        {
            this.funct[i] = repTags(this.funct[i], '$rand', this.rand, this.rand.length);
            this.funct[i] = repTags(this.funct[i], '$word', this.word, this.word.length);
            this.funct[i] = repTags(this.funct[i], '$masR', this.masR, this.masR.length, false, 'mas');
            this.funct[i] = repTags(this.funct[i], '$masL', this.masR, this.masR.length, false, 'length');
            this.funct[i] = repTags(this.funct[i], '$docF', this.docT, this.docT.length);
            this.funct[i] = repTags(this.funct[i], '$logF', this.logF, this.logF.length, false, 'prog');
            this.funct[i] = repTags(this.funct[i], '$logT', this.logTable, this.logTable.length,);
            this.funct[i] = repTags(this.funct[i], '$comp', this.comp, i);
            
            this.comp.push(eval(`() => { ${this.funct[i]} }`)());
        }
    }
    fillCode()
    {
        for (let i=0; i<this.code.length; ++i)
        {
            this.code[i] = repTags(this.code[i], '$rand', this.rand, this.rand.length);
            this.code[i] = repTags(this.code[i], '$word', this.word, this.word.length);
            this.code[i] = repTags(this.code[i], '$masR', this.masR, this.masR.length, false, 'mas');
            this.code[i] = repTags(this.code[i], '$masL', this.masR, this.masR.length, false, 'length');
            this.code[i] = repTags(this.code[i], '$docF', this.docT, this.docT.length);
            this.code[i] = repTags(this.code[i], '$logF', this.logF, this.logF.length, false, 'prog');
            this.code[i] = repTags(this.code[i], '$logT', this.logT, this.logT.length, true);
            this.code[i] = repTags(this.code[i], '$comp', this.comp, this.comp.length);
            this.code[i] = repTags(this.code[i], '$code', this.code, i);
            
            console.log(this.code[i]);
            this.codeRes.push(eval(`() => { ${this.code[i]} }`));

            this.codeTable.push(`<table><tbody>
                                    <tr>
                                        <th style="text-align:center">Бейсик</th>
                                        <th style="text-align:center">Python</th>
                                        <th style="text-align:center">Паскаль</th>
                                        <th style="text-align:center">Алгоритмический язык</th>
                                        <th style="text-align:center">Си++</th>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center">${toBasic(this.code[i])}</td>
                                        <td style="text-align:center">${toPython(this.code[i])}</td>
                                        <td style="text-align:center">${toPascal(this.code[i])}</td>
                                        <td style="text-align:center">${toAlg(this.code[i])}</td>
                                        <td style="text-align:center">${toCplus(this.code[i])}</td>
                                    </tr>
                                </tbody></table>`);
            
        }
    }

    create_ex()
    {
        this.fillRand();
        this.fillWord();
        this.fillMasR();
        this.fillLogF();
        this.fillLogT();
        this.fillComp();
        this.fillCode();

        this.text = repTags(this.text, '$rand', this.rand, this.rand.length);
        this.text = repTags(this.text, '$word', this.word, this.word.length);
        this.text = repTags(this.text, '$masR', this.masR, this.masR.length, false, 'mas');
        this.text = repTags(this.text, '$masL', this.masR, this.masR.length, false, 'length');
        this.text = repTags(this.text, '$docF', this.docF, this.docF.length);
        this.text = repTags(this.text, '$docN', this.docN, this.docN.length);
        this.text = repTags(this.text, '$logF', this.logF, this.logF.length, false, 'text');
        console.log(this.logTable);
        this.text = repTags(this.text, '$logT', this.logTable, this.logTable.length);
        this.text = repTags(this.text, '$comp', this.comp, this.comp.length);
        this.text = repTags(this.text, '$code', this.codeTable, this.codeTable.length);

        console.log('ex_ptr1', this.text, this.fres);

        this.fres = repTags(this.fres, '$rand', this.rand, this.rand.length);
        this.fres = repTags(this.fres, '$word', this.word, this.word.length);
        this.fres = repTags(this.fres, '$masR', this.masR, this.masR.length, false, 'mas');
        this.fres = repTags(this.fres, '$masL', this.masR, this.masR.length, false, 'length');
        this.fres = repTags(this.fres, '$docF', this.docT, this.docT.length);
        this.fres = repTags(this.fres, '$docN', this.docN, this.docN.length);
        this.fres = repTags(this.fres, '$logF', this.logF, this.logF.length, false, 'prog');
        this.fres = repTags(this.fres, '$logT', this.logT, this.logT.length, true);
        this.fres = repTags(this.fres, '$comp', this.comp, this.comp.length);
        this.fres = repTags(this.fres, '$code', this.codeRes, this.codeRes.length);
        
        console.log('ex_ptr2', this.text, this.fres);
        this.res = eval(`() => { ${this.fres} }`)();
    }


    return_text() { return this.text; }

    return_res() { return this.res; }
    return_res_fun() { return this.fres; }
}