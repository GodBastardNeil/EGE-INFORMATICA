import React, {useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom'

import {observer} from "mobx-react-lite";

import {Spinner, Container, Form, Button, Row} from "react-bootstrap";

import {getTest, setTest} from "../http/testAPI";
import { STUDENT_ROUTE } from '../utils/consts';

const Test = observer(() => {
    const testId = useParams().Id;
    let map = {};
    const history = useHistory();
    const [test, set_Test] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(testId);
        getTest(testId).then(data => {
            map = {};
            console.log(data);
            set_Test(data);
            for (let into of test) { map += {taskId: ""}; }
        }).finally(() => setLoading(false))
    }, []);

    if (loading) { return <Spinner animation={"grow"}/> }


    const click = async () => {
        console.log(map);
        let ans = '';
        let score = 0;
        test.forEach((t) => {
            score += (map[t.taskId] == t.right_answer)
        });
        console.log(map, score);
        
        await setTest(map, score, testId);
        history.push(STUDENT_ROUTE);
    }

    return (
        <Container className="mt-3">
            <Row>
                <h2>Тест № {testId}</h2>
            </Row>
            <Row className="d-flex flex-column m-3">
                {test.map((info, index) =>
                    // это в TestTask
                    <Row key={info.taskId} style={{background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10}}>

                        <h4>Задание № {info.taskId}</h4>
                        <div className="content" dangerouslySetInnerHTML={{__html: info.text}}></div>

                        <Form.Control
                            className="mt-3"
                            value={map[info.taskId]}
                            id={`ex_${info.taskId}`}
                            onChange={e => {
                                map[info.taskId] = e.target.value;
                            }}
                        />
                    </Row>
                )}
                <Button variant={"outline-success"} onClick={click}>
                    Завершить
                </Button>
            </Row>
        </Container>
    );
});

export default Test;