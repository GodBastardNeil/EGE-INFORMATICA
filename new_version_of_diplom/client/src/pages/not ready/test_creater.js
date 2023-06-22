import React, {useContext} from 'react';
import {useLocation, useHistory} from "react-router-dom";

import {observer} from "mobx-react-lite";

import {Button, Container} from "react-bootstrap";

import {Context} from "../../index";
import {fetchTemplate, setTemplate} from "../http/templateAPI";

import {ADMIN_ROUTE} from '../../utils/consts';


const Test_Creator = observer(() => {
    const Id = useParams().id;
    const history = useHistory();
    const [loading, setLoading] = useState(true);

    let {user} = useContext(Context);

    let text = '';
    const [rand, setRand] = useState('');
    const [comp, setComp] = useState('');
    let rand_tmp = new Map();
    let comp_tmp = new Map();

    if (Id != -1)
    {
        useEffect(() => {
            fetchTemplate().then(data => {
                text = data.text;
                setRand(JSON.parse(data.rand));
                setComp(JSON.parse(data.comp));
                console.log(rand);
                console.log(comp);
            }).finally(() => setLoading(false));
        }, []);
    }

    if (loading) { return <Spinner animation={"grow"}/> }

    const click = () => {

        let j = 0;
        let div = document.getElementById('div');
        div.innerHTML = "";
        if (Id != -1)
        {
            div.innerHTML += "<p>";
            rand.forEach((r) => {
                if (text.indexOf(r[0], 0) != -1)
                {
                    rand_tmp[r[0]] = r[1];
                    div.innerHTML += `${r[0]} - <input type="number" name="input" id="${r[0]}_min" value="${r[1][0]}">
                    <input type="number" name="input" id="${r[0]}_max" value="${r[1][1]}">`;
                }
            });
            div.innerHTML += "</p>";

            div.innerHTML += "<p>";
            comp.forEach((c) => {
                if (text.indexOf(c[0], 0) != -1)
                {
                    comp_tmp[c[0]] = c[1];
                    div.innerHTML += `${c[0]} - <input type="text" name="input" id="${c[0]}" value="${c[1]}>`;
                }
            });
            div.innerHTML += "</p>";

        } else
        {
        
            j = text.indexOf('$rand', j);
            div.innerHTML += "<p>";
            while (j != -1)
            {
                j += 4;
                rand_tmp[`$rand${text[j]}`] = [0, 0];
                div.innerHTML += `$rand${text[j]} - <input type="number" name="input" id="$rand${text[j]}_min">
                <input type="number" name="input" id="$rand${text[j]}_max">`;
                j = text.indexOf('$rand', j);
            }
            div.innerHTML += "</p>";
    
            j = 0;
            j = text.indexOf('$comp', j);
            div.innerHTML += "<p>";
            while (j != -1)
            {
                j += 4;
                comp_tmp[`$comp${text[j]}`] = '';
                div.innerHTML += `$comp${text[j]} - <input type="text" name="input" id="$comp${text[j]}">`;
                j = text.indexOf('$comp', j);
            }
        }
        div.innerHTML += `<Button id="Button2" variant={"outline-success"} onClick={click2}>{'Ок'}</Button></p>`;
    }

    const click2 = () => {
        try {
            let min, max;
            rand_tmp.forEach((values, keys)=>{
                min = document.getElementById(`${keys}_min`);
                max = document.getElementById(`${keys}_max`);
    
                if (min > max)
                {
                    max = [min, min = max][0];
                } else if (min == max) { throw `Одинаковое значение min, max - ${keys}`; }
                rand_tmp[keys][0] = min;
                rand_tmp[keys][1] = max;
            });
            comp_tmp.forEach((values, keys)=>{
                comp_func = document.getElementById(`${keys}`);
    
                comp_tmp[keys] = comp_func;
            });

            setTemplate(text, rand_tmp, comp_tmp);
        } catch (error)
        {
            console.log(error);
            alert(error);
        }
    }
  
    return (
        <Container id="Container">
            <input
                type="text"
                value={text}
            />
            <Button id="Button" variant={"outline-success"} onClick={click}>
                {'Ок'}
            </Button>
            <div id="div">
            </div>
            <Button id="Button" variant={"outline-success"} onClick={() => history.push(ADMIN_ROUTE)}>
                {'Выход'}
            </Button>
        </Container>
    );
});
  
  export default Test_Creator;