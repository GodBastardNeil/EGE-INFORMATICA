import React, {useState, useEffect} from 'react';

import {observer} from "mobx-react-lite";

import {Spinner, Row} from "react-bootstrap";

import {getForStat} from "../../http/teacherAPI";

const StudentList = observer((studlist) => {
    const [allstud, setStudents] = useState('');
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        getForStat().then(data => {
            setStudents(data);
        }).finally(() => setLoading(false))
    }, []);

    if (loading) { return <Spinner animation={"grow"}/> }
    
    const handleOnChange = (id) => {
        studlist.push(id);
    };

    return (
        <Row>
            <Row>
                <h2>Список учеников</h2>
            </Row>
            <Row className="d-flex flex-column m-3">
                {allstud.map(student =>
                    <div className="studlist">
                        <input type="checkbox" id={student.id} name="stud" value={student.id} onChange={() => handleOnChange(student.id)} />
                        <label for={student.id}>{student.email}</label>
                    </div>
                )}
            </Row>
        </Row>
    );
});

export default StudentList;