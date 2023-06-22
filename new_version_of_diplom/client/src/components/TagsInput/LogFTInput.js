import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Spinner, Row, Col, Form, Container} from "react-bootstrap";

import {Context} from "../../index";

const LogFTInput = observer(() => {
    const {temp} = useContext(Context);
    let i=0;

    //if (ft['show'] == '' || ft['all'] == '' || ft['show'] == '') { throw err; }
    return (
        <Container id="Container">
        {
            temp.logFT.length > 0 ?
                <Row className="d-flex flex-column m-3">
                    <h4>Таблица истинности</h4>
                    {
                        temp.logFT.map(item => (
                            <Row className="d-flex flex-column m-3">
                                <h4>logFT{++i}</h4>
                                <Form.Check className="mt-3" name="group1"
                                    label={'Все результаты?'}
                                    onChange={e => {temp.logFT(i-1, 'all', e.target.value); } }
                                    type="checkbox"
                                />
                                <Form.Check className="mt-3" name="group1"
                                    label={'Есть ли скрытые поля?'}
                                    onChange={e => {temp.logFT(i-1, 'hidden', e.target.value); } }
                                    type="checkbox"
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
export default LogFTInput;