import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom'

import {observer} from "mobx-react-lite";

import {Spinner, Row} from "react-bootstrap";

import {TEST_ROUTE} from '../utils/consts';

import {getTestTasks} from "../http/testAPI";

import UserAnswerTab from "./TestStatTables/UserAnswerTab";

const TaskList = observer(() => {
    const {testId} = useParams();

    const [tasks, setTasks] = useState();
    const [loading, setLoading] = useState(true);

    let isTest = (location.pathname === TEST_ROUTE);

    useEffect(() => {
        getTestTasks(testId).then(data => {
            console.log(data);
            setTasks(data);
            console.log(tasks);
        }).finally(() => setLoading(false))
    }, []);

    if (loading) { return <Spinner animation={"grow"}/> }

    return (
        <Row className="d-flex flex-column m-3">
            {
                tasks.map((info, index) =>
                    <Row key={info.tastId} style={{background: index % 2 === 0 ? 'lightgray' : 'transparent', padding: 10}}>

                        <h4>Задание № {info.tastId}</h4>
                        <div className="content" dangerouslySetInnerHTML={{__html: info.text}}></div>

                        {
                            (isTest) ?
                                <></>
                            :
                                <Row className="d-flex flex-column m-3">
                                    <div>Максимальный балл: {info.max_score}</div>
                                    <div>Правильный ответ: {info.right_answer}</div>
                                    <UserAnswerTab key={info.tastId} tastId={info.tastId}/>
                                </Row>
                        }
                    </Row>
                )
            }
        </Row>
    );
});

export default TaskList;