import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom'

import {observer} from "mobx-react-lite";

import {Spinner, Row} from "react-bootstrap";

import {getUserAnswers} from "../http/testAPI";

const UserAnswerTab = observer((taskId) => {
    const {testId} = useParams();
    
    const [answers, setAnswers] = useState();
    const [loading, setLoading] = useState(true);

    let i = 0;

    useEffect(() => {
        getUserAnswers(testId, taskId).then(data => {
            console.log(data);
            setAnswers(data);
            console.log(answers);
        }).finally(() => setLoading(false))
    }, []);

    if (loading) { return <Spinner animation={"grow"}/> }

    return (
        <Row className="d-flex flex-column m-3">
            <table border="1">
                <tr>
                    <th>Ваши ответы</th>
                    <th>Оценка</th>
                </tr>
                {
                    answers.user_answers.map((info, index) => {
                        <tr><td>info</td><td>{answers.user_scores[i++]}</td></tr>
                    })
                }
            </table>
        </Row>
    );
});

export default UserAnswerTab;