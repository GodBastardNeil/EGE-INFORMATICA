import React, {useState, useEffect, useContext} from 'react';
import {useHistory} from "react-router-dom";

import {observer} from "mobx-react-lite";

import {Container, Spinner, Form, ListGroup, Button, Row} from "react-bootstrap";

import {Context} from "../../index";

import {createTest, createTestEx} from "../../http/topicAPI";
import {getForStat} from "../../http/teacherAPI";

import { TEACHER_ROUTE, TEST_ROUTE } from '../../utils/consts';

const TypeList = observer(({topic, studlist}) => {
    const {user} = useContext(Context);
    let map = new Map();
    const history = useHistory();

    const [allstud, setStudents] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user.data.roleId != 2)
        {
            getForStat().then(data => {
                setStudents(data);
            }).finally(() => setLoading(false))
        } else { setLoading(false) }
    }, []);

    if (loading) { return <Spinner animation={"grow"}/> }

    console.log(topic);
    console.log(studlist);

    const handleOnChange = (id) => {
        studlist.push(id);
    };

    const click = async () => {
        try {
            console.log(map.size, studlist.length);
            if (map.size > 0 && studlist.length > 0)
            {
                await createTest(studlist, map).then(data => {
                    console.log(data);
                    map.forEach((value, key, map) => {
                        createTestEx(data, key, value);
                    });
                    if (user.data.roleId == 2)
                    {
                        history.push(TEST_ROUTE + '/' + data);
                    } else { history.push(TEACHER_ROUTE); }
                });
            }
        } catch (e)
        {
            console.log(e.message);
            alert(e.message)
        }
    }

    return (
        <Row hidden={(user.data.roleId == 3 && studlist.length > 0) ? 'true' : 'fasle'} className="d-flex flex-column m-3">
            {
                (user.data.roleId == 3) ?
                    <Row className="d-flex flex-column m-3">
                        <Row className="d-flex flex-column m-3">
                            <h2>Список учеников</h2>
                            {allstud.map(student =>
                                <div className="studlist">
                                    <input type="checkbox" id={student.id} name="stud" value={student.id} onChange={() => handleOnChange(student.id)} />
                                    <p for={student.id}>{student.login}</p>
                                </div>
                            )}
                        </Row>
                    </Row>
                :
                    <></>
            }
            <ListGroup>
                {topic.map((top, index) =>
                    <ListGroup.Item
                    style={{cursor: 'pointer'}}
                    key={top.id}>
                        {top.title}

                        {top.types.map(type =>
                            <ListGroup.Item
                            style={{cursor: 'pointer'}}
                            key={`TypeList_${type.id}`}>
                                {type.title}
                                <Form.Control
                                    className="mt-3"
                                    min={0} max={100}
                                    value={map.get(type.id)}
                                    id={`type_${type.id}`}
                                    onChange={e => {
                                        map.set(type.id, e.target.value);
                                    }}
                                    type="number"
                                />
    
                            </ListGroup.Item>
                        )}
                    </ListGroup.Item>
                )}
            </ListGroup>
        
            <Row>
                <Button variant={"outline-success"} onClick={click}>
                    Генерация теста
                </Button>
                {
                    (user.data.roleId == 3) ?
                        /*<Button variant={"outline-success"} onClick={click2}>
                            Создание теста
                        </Button>*/
                        <></>
                    :
                        <></>
                }
            </Row>
        </Row>
    );
});

export default TypeList;