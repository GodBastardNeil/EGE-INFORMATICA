import React, {useState, useEffect, useContext} from 'react';

import {observer} from "mobx-react-lite";

import {Spinner, Row, Col, Container} from "react-bootstrap";
import {Context} from "../index";

import {getMainStat} from "../http/studentAPI";

import TeachTestTab from "./TestStatTables/TeachTestTab";
import AllTestTab from "./TestStatTables/AllTestTab";
import ExStatTab from "./TestStatTables/ExStatTab";

const StudentBlank = observer(({student}) => {
    let {user} = useContext(Context);
    let [main, setMainStat] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(student.id);
        getMainStat(student.id).then(data => {
            setMainStat(data);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) { return <Spinner animation={"grow"}/>; }

    return (
        <Container className="mt-3">
            <details>
                <summary>{student.login}</summary>
                <Row>
                        Количество тестов: {main.test_score}; <br></br>
                        Количество несделанных тестов: {main.notest_score}; <br></br>
                </Row>
                <TeachTestTab key={student.id} studentId={student.id}/>
                <AllTestTab key={student.id} studentId={student.id}/>
                <ExStatTab key={student.id} studentId={student.id}/>
            </details>
        </Container>
    );
});

export default StudentBlank;