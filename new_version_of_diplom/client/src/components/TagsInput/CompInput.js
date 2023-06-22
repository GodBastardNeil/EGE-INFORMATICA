import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Spinner, Row, Col, Form, Container} from "react-bootstrap";

import {Context} from "../../index";

const CompInput = observer(() => {
    const {temp} = useContext(Context);
    let i=0;

    return (
        <Container id="Container">
        {
            temp.comp.length > 0 ?
                <Row className="d-flex flex-column m-3">
                    <h4>Вычисляемое число</h4>
                    {
                        temp.comp.map(item => (
                            <Row className="d-flex flex-column m-3">
                                <Form.Control as="textarea" rows={10}
                                    placeholder="Введите формулу"
                                    label={`comp${i}`}
                                    value={item}
                                    onChange={e => {temp.setComp(i-1, e.target.value)}}
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
export default CompInput;