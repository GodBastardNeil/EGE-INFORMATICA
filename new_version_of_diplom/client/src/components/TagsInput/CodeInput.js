import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Spinner, Row, Col, Form, Container} from "react-bootstrap";

import {Context} from "../../index";

const CodeInput = observer(() => {
    const {temp} = useContext(Context);
    let i=0;

    return (
        <Container id="Container">
        {
            temp.code.length > 0 ?
                <Row className="d-flex flex-column m-3">
                    <h4>Код</h4>
                    {
                        temp.code.map(item => (
                            <Row className="d-flex flex-column m-3">
                                <Form.Control as="textarea" rows={10}
                                    placeholder="Введите код"
                                    label={`code${i}`}
                                    value={item}
                                    onChange={e => {temp.setCode(i-1, e.target.value)}}
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
export default CodeInput;