import React, {useContext, useState} from 'react';
import {useHistory} from "react-router-dom";

import {observer} from "mobx-react-lite";

import {Container, Form, Card, Button, Row} from "react-bootstrap";

import {Context} from "../index";

import {ADMIN_TOPIC_ROUTE} from "../utils/consts";
import {login} from "../http/userAPI";

const AdminAuth = observer(() => {
    let {user} = useContext(Context);
    const history = useHistory();

    const [login_, setLogin] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const click = async () => {
        try {
            if (login_ && password)
            {
                let data = await login(login_, password, 1);
                console.log('data', data);
    
                user.setData(data);
                user.setIsAuth(true);
                
                console.log('Auth: ' + user.id + ' ' + user.role);
                history.push(ADMIN_TOPIC_ROUTE + '/0');
            } else { throw new SyntaxError("Данные некорректны"); }
        } catch (e)
        {
            console.log(e.message);
            alert(e.message)
        }

    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 54}}
        >
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto">Авторизация</h2>
                <Form className="d-flex flex-column">
                    <Form.Control className="mt-3"
                        placeholder="Введите ваш login..."
                        value={login_}
                        onChange={e => {setLogin(e.target.value);}}
                    />
                    <Form.Control className="mt-3"
                        placeholder="Введите ваш пароль..."
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        <Button variant={"outline-success"} onClick={click}>Войти</Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});
export default AdminAuth;