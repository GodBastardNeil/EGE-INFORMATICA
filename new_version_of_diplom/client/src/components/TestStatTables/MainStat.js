import React, {useState, useEffect} from 'react';

import {observer} from "mobx-react-lite";

import {Spinner, Row} from "react-bootstrap";

import {getMainStat} from "../http/studentAPI";

const MainStat = observer(({student}) => {
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
        <Row className="d-flex flex-column m-3">
            Количество тестов: {main.test_score}; <br></br>
            Количество несделанных тестов: {main.notest_score}; <br></br>
        </Row>
    );
});

export default MainStat;