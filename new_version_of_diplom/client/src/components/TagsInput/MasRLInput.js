import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Spinner, Row, Col, Form, Container} from "react-bootstrap";

import {Context} from "../../index";

const MasRLInput = observer(() => {
    const {temp} = useContext(Context);
    let i=0;

    return (
        <Container id="Container">
        {
            temp.masRL.length > 0 ?
                <Row className="d-flex flex-column m-3">
                    <h4>Список слова</h4>
                    {
                        temp.masRL.map(item => (
                            <Row className="d-flex flex-column m-3">
                                <h4>masR{++i}</h4>
                                <Form.Control
                                    type="text"
                                    placeholder="Введите список"
                                    label={`masR${i}`}
                                    value={item['mas']}
                                    onChange={e => {temp.setMasRL(i-1, 'mas', e.target.value)}}
                                />
                                <Form.Control className="mt-3"
                                    placeholder="Введите min"
                                    type="text"
                                    label={`Минимум`}
                                    value={item['min']}
                                    onChange={e => {temp.setMasRL(i-1, 'min', e.target.value)}}
                                />
                                <Form.Control className="mt-3"
                                    placeholder="Введите max"
                                    type="text"
                                    label={`Максимум`}
                                    value={item['max']}
                                    onChange={e => {temp.setMasRL(i-1, 'max', e.target.value)}}
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
export default MasRLInput;