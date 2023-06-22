import React, {useContext, useState, useEffect} from 'react';
import {useParams, useHistory} from 'react-router-dom'

import {observer} from "mobx-react-lite";

import {Spinner, Container, Button, Row} from "react-bootstrap";

import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'

import {Context} from "../index";
import {getTest} from "../http/testAPI";
import { STUDENT_ROUTE, TEACHER_ROUTE } from '../utils/consts';

const Stat = observer(() => {
    const {testId, userId} = useParams();
    let {user} = useContext(Context);

    const history = useHistory();
    const [test, setTest] = useState();
    const [loading, setLoading] = useState(true);

    let i = 0;

    useEffect(() => {
        getTest(testId).then(data => {
            console.log(data);
            setTest(data);
            console.log(test);
        }).finally(() => setLoading(false))
    }, []);

    if (loading) { return <Spinner animation={"grow"}/> }

    return (
        <Container className="mt-3">
            <Row>
                <h2>Тест № {test.testId}</h2>
                <h3>Создатель - {test.userId}</h3>
                <h3>Тестируемый - {test.studentId}</h3>
                <div>Даты тестирования: {stat.dates}</div>
                <div>Все оценкци: {stat.user_scores}</div>
                <div>Максимальный балл: {stat.max_score}</div>
            </Row>
            <Row className="d-flex flex-column m-3">
                {
                    ex.map((info, index) =>
                        <Row key={info.tastId} style={{background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10}}>

                            <h4>Задание № {info.tastId}</h4>
                            <div className="content" dangerouslySetInnerHTML={{__html: info.text}}></div>

                            <div>Правильный ответ: {info.right_answer}</div>
                            <div>
                                <table border="1">
                                    <tr>
                                        <th>Ваши ответы</th>
                                        <th>Оценка</th>
                                    </tr>
                                    {
                                        (info.tastId == 1) ?
                                            <tr><td>9</td><td>1</td></tr>
                                            /*stat.answers.forEach((element) => {
                                                console.log(JSON.stringify(element));
                                                <tr><td>{JSON.stringify(element)[info.tastId]}</td><td>{stat.scores[++i]}</td></tr>
                                            })*/
                                        :
                                            (info.tastId == 2) ?
                                                <tr><td>4</td><td>1</td></tr>
                                                /*stat.answers.forEach((element) => {
                                                    console.log(JSON.stringify(element));
                                                    <tr><td>{JSON.stringify(element)[info.tastId]}</td><td>{stat.scores[++i]}</td></tr>
                                                })*/
                                            :
                                                <tr><td>448</td><td>1</td></tr>
                                    }
                                </table>
                            </div>
                        </Row>
                    )
                }
                <Button onClick={() => history.push((user.data.roleId == 2) ? STUDENT_ROUTE : TEACHER_ROUTE)}>
                    Вернуться
                </Button>
            </Row>
        </Container>
    );
});

export default Stat;