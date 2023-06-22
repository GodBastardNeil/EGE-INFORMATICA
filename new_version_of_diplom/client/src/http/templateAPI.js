import {$host, $authHost} from "./index";
import jwt_decode from "jwt-decode";

const checkTag = (text, tag, val = '') => {
    let arr = []
    let j = 0;
    let step = (tag).length;
    while ((j = text.indexOf(tag, j)) != -1)
    {
        j += step;
        let num = text.substring(j, text.indexOf('$', j))
        console.log(num);
        if (num <= 0) { throw new Error(`Индексы тега ${tag}, должны быть больше 0`); }
        if (num > arr.length+1) { throw new Error(`Индексы тега ${tag}, должны быть больше 0`); }
        if (num > arr.length) { arr.push(val); }
    }
    return arr;
}
const checkDoc = (text) => {
    let tag = '$docF'
    let stag = '$docN'
    let val = { file: ``, isName: false, name: `` }
    let arr = []
    let j = 0;
    let step = (tag).length;
    while ((j = text.indexOf(tag, j)) != -1)
    {
        j += step;
        let num = text.substring(j, text.indexOf('$', j))
        if (num <= 0) { throw new Error(`Индексы тега ${tag}, должны быть больше 0`); }
        if (num > arr.length+1) { throw new Error(`Индексы тега ${tag}, должны быть больше 0`); }
        if (num > arr.length)
        {
            if (text.indexOf(`$docN${arr.length}$`, 0) != -1) { val.isName = true; }
            arr.push(val);
            val.isName = false;
        }
    }
    j = 0;
    step = (stag).length;
    while ((j = text.indexOf(stag, j)) != -1)
    {
        j += step;
        let num = text.substring(j, text.indexOf('$', j))
        if (num > arr.length) { throw new Error(`Тег ${stag} сопутсивует несуществующему тегу`); }
    }
    return arr;
}
const checkLog = (text) => {
    let tag = '$logF' //{show: false, all: true, hidden: false}
    let stag = '$logT'
    let val = {show: false, all: true, hidden: false};
    let arr = []
    let j = 0;
    let step = (tag).length;
    while ((j = text.indexOf(tag, j)) != -1)
    {
        j += step;
        let num = text.substring(j, text.indexOf('$', j))
        if (num <= 0) { throw new Error(`Индексы тега ${tag}, должны быть больше 0`); }
        if (num > arr.length+1) { throw new Error(`Индексы тега ${tag}, должны быть больше 0`); }
        if (num > arr.length)
        {
            if (text.indexOf(`$LogT${arr.length}$`, 0) != -1) { val.show = true; }
            arr.push(val);
            val.show = false;
        }
    }
    j = 0;
    step = (stag).length;
    while ((j = text.indexOf(stag, j)) != -1)
    {
        j += step;
        let num = text.substring(j, text.indexOf('$', j))
        if (num > arr.length) { throw new Error(`Тег ${stag} сопутсивует несуществующему тегу`); }
    }
    return arr;
}
/*const checkInFun = (fun, tag, max) => {
    let j = 0;
    let step = (tag).length;
    while ((j = fun.indexOf(tag, j)) != -1)
    {
        j += step;
        let num = fun.substring(j, fun.indexOf('$', j))
        if (num > max) { throw new Error(`В ответе используется ${tag}, которого нет`); }
    }
}

const getRandValue = (rand_tmp, i, stag, etag) =>
{
    let step = ('$rand').length;
    let j = rand_tmp[i][stag].indexOf('$rand');
    if (j != -1)
    {
        let n = rand_tmp[i][stag][j+step];
        if (i <= n) { throw new Error(`Есть отстылка на элемент, который следует после или на самого себя - $rand - ${i}, ${n}`); }

        while ((j = rand_tmp[n][etag].indexOf('$rand')) != -1)
        {
            let n = rand_tmp[i][etag][j+step];
            if (i <= n) { throw (`Есть отстылка на элемент, который следует после или на самого себя - $rand - ${i}, ${n}`); }
        }
        return rand_tmp[n][etag];
    } else { return rand_tmp[i][stag]; }
}*/
export const setInputs = async (id, text, rand, word, comp, code,
                                            masRL, logFT, docFN, files) => {
    console.log('setInputs', id, text, rand, word, comp, code,
                                        masRL, logFT, docFN, files);
    const formData = new FormData();
    formData.append(`id`, id);
    formData.append(`rand`, rand);
    formData.append(`word`, word);
    formData.append(`comp`, comp);
    formData.append(`code`, code);
    formData.append(`masRL`, masRL);
    formData.append(`logFT`, logFT);
    formData.append(`docFN`, docFN);
    formData.append(`files`, files);
    const {data} = await $authHost.post('api/template/inputs', {id, rand, word, comp, code,
                                                                    masRL, logFT, docFN, files});
    return data;
}



export const getTemplate = async (id) => {
    const {data} = await $authHost.get('api/template/' + id);
    return data;
}


export const setText = async (id, typeId, text, ans) => {
    let rand = checkTag(text, '$rand', {min: '', max: ''});
    let word = checkTag(text, '$word');
    let comp = checkTag(text, '$comp');
    let code = checkTag(text, '$code');

    let masRL = checkTag(text, 'masR', {mas: '', min: '', max: ''});
    let docFN = checkDoc(text);
    let logFT = checkLog(text);
    
    console.log(ans,
        rand, word, comp, code,
        masRL, docFN, logFT);
    const {data} = await $authHost.post('api/template/text', {id, typeId, text, ans,
                                                                rand, word, comp, code,
                                                                masRL, docFN, logFT
                                                            });
    return data;
}