import React, {useState, useEffect, useContext} from 'react';
import {useParams, useHistory} from "react-router-dom";

import {observer} from "mobx-react-lite";

import {Spinner, Button, ButtonGroup, Form, Container} from "react-bootstrap";

import {Context} from "../index";

import {getTemplate, setText} from "../http/templateAPI";

import {ADMIN_TEMPLATE_ROUTE, TEMPLATE_INPUTS_ROUTE} from '../utils/consts';


const Template = observer(() => {
    const {typeId, Id} = useParams();
    const {temp} = useContext(Context);

    const history = useHistory();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (Id != -1)
        {
            getTemplate(Id).then(data => {
                console.log(data);
                temp.set(data);
            }).finally(() => setLoading(false));
        } else { setLoading(false); }
    }, []);

    if (loading) { return <Spinner animation={"grow"}/> }

    const click = async () => {
        try
        {
            console.log('text', Id, typeId, temp.text, temp.ans);
            await setText(Id, typeId, temp.text, temp.ans).then(tid => {
                console.log('tid', tid);
                history.push(TEMPLATE_INPUTS_ROUTE + `/${typeId}/${tid.id}`);
            });
        } catch (e) { console.log(e.message); alert(e.message); }
    }
    return (
        <Container id="Container">
            <Form className="d-flex flex-column">
                <div>
                    <p>
                        Теги должны идти в порядке возрастания, могут быть повторения
                    </p>
                    <p>
                        Пример: $rand1$, $rand2$, $rand3$, $rand1$, $rand4$, $rand2$
                    </p>
                    <p>
                        Теги одного типа могут ссылаться только на те, что перед ними по порядку
                    </p>
                    <p>
                        Номера сопутствующих тегов нумеруется в соответствии с тем тегом, который он дополняет
                    </p>
                    <p>
                        $rand_$
                        $comp_$
                        $code_$
                        $word_$
                        $masR_$ - $masL_$
                        $logF_$ - $logT_$
                        $docF_$ - $docN_$
                    </p>
                </div>
                <Form.Control as="textarea" rows={3}
                    placeholder="Введите текст шаблона"
                    label={`Текст`}
                    value={temp.text}
                    onChange={e => {temp.setText(e.target.value);}}
                />
                <Form.Control as="textarea" rows={10}
                    placeholder="Введите текст ответа"
                    label={`Ответ`}
                    value={temp.ans}
                    onChange={e => {temp.setAns(e.target.value);}}
                />

                <ButtonGroup>
                    <Button variant={"outline-danger"} onClick={() => history.push(ADMIN_TEMPLATE_ROUTE + `/${typeId}`)}>
                        Назад
                    </Button>
                    <Button variant={"outline-success"} onClick={click}>
                        Далее
                    </Button>
                </ButtonGroup>
            </Form>
        </Container>
    );
});
  
export default Template;