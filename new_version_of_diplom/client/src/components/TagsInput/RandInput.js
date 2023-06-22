import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Spinner, Row, Col, Form, Container} from "react-bootstrap";

import {Context} from "../../index";

const RandInput = observer(() => {
    const {temp} = useContext(Context);
    let i=0;

    return (
        <Container id="Container">
        {
            temp.rand.length > 0 ?
                <Row className="d-flex flex-column m-3">
                    <h4>Случайное число</h4>
                    { // не работает - вводишь первый мменяется второй
                        temp.rand.map(item => (
                            <Row className="d-flex flex-column m-3">
                                <h4>rand{++i}</h4>
                                <Form.Control className="mt-3"
                                    placeholder="Введите min"
                                    type="text"
                                    label={`Минимум`}
                                    value={item['min']}
                                    onChange={e => {item['min'] = (e.target.value)}}
                                />
                                <Form.Control className="mt-3"
                                    placeholder="Введите max"
                                    type="text"
                                    label={`Максимум`}
                                    value={item['max']}
                                    onChange={e => {item['max'] = (e.target.value)}}
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
export default RandInput;