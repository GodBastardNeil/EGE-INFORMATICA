import React, {useContext, useState, useEffect} from 'react';

import {observer} from "mobx-react-lite";

import {Spinner, Row} from "react-bootstrap";

import StudentBlank from "../components/StudentBlank";
import {getStudents} from "../http/teacherAPI";

const Teacher = observer(() => {
    const [students, setStudents] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStudents().then(data => {
            setStudents(data);
            console.log(students);
        }).finally(() => setLoading(false))
    }, []);

    if (loading) { return <Spinner animation={"grow"}/> }

    return (
        students.map(s =>
            <Row className="d-flex">
                <StudentBlank key={s.id} student={s}/>
            </Row>
        )
    );
});

export default Teacher;