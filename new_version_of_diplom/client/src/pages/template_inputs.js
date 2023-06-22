import React, {useState, useEffect, useContext} from 'react';
import {useParams, useHistory} from "react-router-dom";

import {observer} from "mobx-react-lite";

import {Spinner, Container, Form, Button, ButtonGroup, Row} from "react-bootstrap";

import {Context} from "../index";

import {getTemplate, setInputs} from "../http/templateAPI";

import {ADMIN_TEMPLATE_ROUTE, TEMPLATE_ROUTE} from '../utils/consts';

import CodeInput from '../components/TagsInput/CodeInput';
import CompInput from '../components/TagsInput/CompInput';
import DocFNInput from '../components/TagsInput/DocFNInput';
import LogFTInput from '../components/TagsInput/LogFTInput';
import MasRLInput from '../components/TagsInput/MasRLInput';
import RandInput from '../components/TagsInput/RandInput';
import WordInput from '../components/TagsInput/WordInput';

const TemplateInputs = observer(() => {
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
                console.log(temp);
            }).finally(() => setLoading(false));
        } else { setLoading(false); }
    }, []);

    if (loading) { return <Spinner animation={"grow"}/> }

    const click = async () => {
        try {
            await setInputs(Id, temp.text, temp.rand, temp.word,
                                temp.comp, temp.code,
                                temp.masRL, temp.logFT,
                                temp.docN, temp.files);
            temp.clear();
            
            history.push(ADMIN_TEMPLATE_ROUTE + `/${typeId}`);
        } catch (e)
        {
            console.log(e.message);
            alert(e.message)
        }
    }
  
    return (
        <Container id="Container">
            <Form className="d-flex flex-column">
                <Form.Control as="textarea" rows={3}
                    placeholder="Введите текст шаблона"
                    label={`Текст`}
                    value={temp.text}
                    onChange={e => {temp.setText(e.target.value);}}
                disabled/>
                <Form.Control as="textarea" rows={10}
                    placeholder="Введите текст ответа"
                    label={`Ответ`}
                    value={temp.ans}
                    onChange={e => {temp.setAns(e.target.value);}}
                disabled/>
                <RandInput/>
                <WordInput/>
                <DocFNInput/>
                <LogFTInput/>
                <MasRLInput/>
                <CodeInput/>
                <CompInput/>

                <ButtonGroup>
                    <Button variant={"outline-danger"} onClick={() => { history.push(TEMPLATE_ROUTE + `/${typeId}/${Id}`); }} >
                        Назад
                    </Button>
                    <Button variant={"outline-success"} onClick={click}>
                        Сохранить
                    </Button>
                </ButtonGroup>
            </Form>
        </Container>
    );
});
  
  export default TemplateInputs;