import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Spinner, Row, Col, Form, Container} from "react-bootstrap";

import {Context} from "../../index";

const WordInput = observer(() => {
    const {temp} = useContext(Context);
    let i=0;

    return (
        <Container id="Container">
        {
            temp.word.length > 0 ?
                <Row className="d-flex flex-column m-3">
                    <h4>Список слова</h4>
                    {
                        temp.word.map(item => (
                            <Row className="d-flex flex-column m-3">
                                <h4>word{++i}</h4>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите список"
                                    label={`word${i}`}
                                    value={item.word[i-1]}
                                    onChange={e => {temp.setWord(i-1, e.target.value)}}
                                />
                            </Row>
                        ))
                    }
                </Row>
            :
                <></>
        }
        </Container>
    );
});
export default WordInput;