import React, {useState, useEffect, useContext} from 'react';
import {useHistory} from "react-router-dom";

import {observer} from "mobx-react-lite";

import {Container, Form, ListGroup, Button, Row} from "react-bootstrap";

import {Context} from "../../index";

import {createTest} from "../../http/topicAPI";

import { TEACHER_ROUTE, TEST_ROUTE } from '../../utils/consts';

const TopicList = observer((topic, studlist) => {
    const {user} = useContext(Context);
    let topicMap = new Map();
    let map = new Map();
    const history = useHistory();
    const [allstud, setStudents] = useState('');
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        getForStat().then(data => {
            setStudents(data);
        }).finally(() => setLoading(false))
    }, []);

    if (loading) { return <Spinner animation={"grow"}/> }

    console.log(topic);
    console.log(studlist);
    
    const click = async () => {
        try {
            console.log(topicMap.size, studlist.length);
            if (topicMap.size > 0 && studlist.length > 0)
            {
                topic.map((top, index) => {
                    for (let i=0; i<topicMap.get(top.id); ++i)
                    {
                        let j = Math.floor(Math.random() * top.types.length);
                        if (map.has(top.types[j].id))
                        {
                            map.set(top.types[j].id, map.get(top.types[j].id)+1);
                        } else { map.set(top.types[j].id, 0); }
                    }
                });
                await createTest(studlist, map).then(data => {
                    console.log(data);
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
            <ListGroup>
                {topic.map((top, index) =>
                    <ListGroup.Item
                    style={{cursor: 'pointer'}}
                    key={`TopicList_${top.id}`}>
                        {top.title}
                        <Form.Control
                            className="mt-3"
                            min={0} max={100}
                            value={topicMap.get(top.id)}
                            id={`topic_${top.id}`}
                            onChange={e => {
                                topicMap.set(top.id, e.target.value);
                            }}
                            type="number"
                        />
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

export default TopicList;