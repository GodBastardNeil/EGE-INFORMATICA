import React, {useState, useEffect, useContext} from 'react';

import {observer} from "mobx-react-lite";

import {Spinner, Container, Row} from "react-bootstrap";

import {Context} from "../index";

import {fetchTopic} from "../http/topicAPI";

import StudentList from "../components/ExCreateList/StudentList"
//import TopicList from "../components/ExCreateList/TopicList"
import TypeList from "../components/ExCreateList/TypeList"

const Topic = observer(() => {
    const {user} = useContext(Context);
    let students = [];
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);

    if (user.data.roleId == 2) { students.push(user.data.id) }
    console.log(students);

    useEffect(() => {
        fetchTopic().then(data => {
            console.log(data);
            setTopics(data);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) { return <Spinner animation={"grow"}/> }

    return (
        <Container className="mt-3">
            <Row>
                <h2>ЗАДАНИЯ</h2>
            </Row>
            <Row>
                {/*<details>
                    <summary>По темам</summary>
                    <TopicList topic={topics} studlist={students}/>
                </details>*/}
                <details>
                    <summary>По типам</summary>
                    <TypeList topic={topics} studlist={students}/>
                </details>
            </Row>
            
        </Container>
    );
});

export default Topic;