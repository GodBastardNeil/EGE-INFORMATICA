import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {Spinner, Row, Col, Form, Container} from "react-bootstrap";

import {Context} from "../../index";

/*
    this._docTN = docTN
    this._docF = docF
*/
const DocFNInput = observer(() => {
    const {temp} = useContext(Context);
    let i=0;

    return (
        <Container id="Container">
        {
            temp.docFN.length > 0 ?
                <Row className="d-flex flex-column m-3">
                    <h4>Файлы</h4>
                    {
                        temp.DocTN.map(item => (
                            <Row className="d-flex flex-column m-3">
                                <Form.Check className="mt-3" name="group1"
                                    label={`docF${i}`}
                                    onChange={e => {temp.serDocF(i-1, e.target.value); } }
                                    type="file"
                                />
                                <Form.Control
                                    type="text"
                                    placeholder="Введите список"
                                    label={`docN${i}`}
                                    value={item}
                                    onChange={e => {temp.setDocFN(i-1, 'name', e.target.value)}}
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
export default DocFNInput;