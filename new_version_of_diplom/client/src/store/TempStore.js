import {makeAutoObservable} from 'mobx';

export default class TempStore {
    constructor(text='', ans='',
                rand=[], comp=[],
                code=[], word='',
                masRL=[], logFT=[],
                docFN='', docF=[], active=false)
    {
        this._text = text
        this._ans = ans
        this._rand = rand
        this._comp = comp
        this._code = code
        this._word = word
        this._masRL = masRL
        this._logFT = logFT
        this._docFN = docFN
        this._docF = docF
        this._active = active
        makeAutoObservable(this)
    }
    set(data)
    {
        this._text = data.text
        this._ans = data.ans
        this._rand = data.rand
        this._comp = data.comp
        this._code = data.code
        this._word = data.word
        this._masRL = data.masRL
        this._logFT = data.logFT
        this._docFN = data.docFN
        this._active = data.active
    }
    clear()
    {
        this._text = '';
        this._ans = '';
        this._rand = [];
        this._comp = [];
        this._code = [];
        this._word = [];
        this._masRL = [];
        this._logFT = [];
        this._docFN = [];
        this._docF = [];
        this._active = false;
    }

    get text()  { return this._text  }
    get ans()   { return this._ans   }
    get rand()  { return this._rand  }
    get comp()  { return this._comp  }
    get code()  { return this._code  }
    get word()  { return this._word  }
    get masRL()  { return this._masRL  }
    get logFT() { return this._logFT }
    get docFN() { return this._docFN }
    get docF()  { return this._docF  }
    get active()  { return this._active  }

    setText(text) { this._text = text; }
    setAns(ans) { this._ans  = ans; }
    setRand(i, tag, val) { this._rand[i][tag] = val; }
    setComp(i, val) { this._comp[i] = val; }
    setCode(i, val) { this._code[i] = val; }
    setWord(i, val) { this._word[i] = val; }
    setMasRL(i, tag, val) { this._masRL[i][tag] = val; }
    setLogFT(i, tag, val) { this._logFT[i][tag] = val; }
    setDocFN(i, tag, val) { this._docFN[i][tag] = val; }
    setDocF(i, val) { this._docF[i] = val; }
    setАctive(val) { this._active = val; }

    genRand(n)
    {
        for(let i=0; i<n; ++i) { this._rand.push({min: '', max: ''}) }
    }
    genComp(n)
    {
        for(let i=0; i<n; ++i) { this._comp.push('') }
    }
    genCode(n)
    {
        for(let i=0; i<n; ++i) { this._code.push('') }
    }
    genWord(n)
    {
        for(let i=0; i<n; ++i) { this._word.push('') }
    }
    genMasRL(n)
    {
        for(let i=0; i<n; ++i) { this._masRL.push({mas: '', min: '', max: ''}) }
    }
    genLogFT(n)
    {
        for(let i=0; i<n; ++i) { this._logFT.push({show: '', all: '', hidden: ''}) }
    }
    genDoc(n)
    {
        for(let i=0; i<n; ++i)
        {
            this._docFN.push({file: '', isName: false, name: ''})
            this._docF.push('')
        }
    }
}