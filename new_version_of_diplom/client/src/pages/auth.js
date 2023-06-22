import React, {useContext, useState, useEffect} from 'react';
import {NavLink, useLocation, useHistory} from "react-router-dom";

import {observer} from "mobx-react-lite";

import {Spinner, Container, Form, Card, Button, Row} from "react-bootstrap";

import {Context} from "../index";

import {LOGIN_ROUTE,
        REGISTRATION_ROUTE,
        STUDENT_ROUTE,
        TEACHER_ROUTE} from "../utils/consts";
import {init, registration, getRoles} from "../http/userAPI";


const Auth = observer(() => {
    let {user} = useContext(Context);
    const location = useLocation();
    const history = useHistory();

    const isLogin = location.pathname === LOGIN_ROUTE;

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState(0);

    const [roles, setRoles] = useState('');

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getRoles().then(data => {
            setRoles(data);
            console.log(roles);
        }).finally(() => setLoading(false))
    }, []);

    if (loading) { return <Spinner animation={"grow"}/> }

    const click = async () => {
        try {
            //setLogin(login.replaceAll(' ', ''));
            //setPassword(password.replaceAll(' ', ''));
            if (roleId == 0 && login == '' && password == '')
            {
                let data;
                if (isLogin)
                {
                    data = await init(login, password, roleId);
                } else { data = await registration(login, password, roleId); }
                console.log('data', data);
    
                user.setData(data);
                user.setIsAuth(true);
                
                if (roleId == 2)
                {
                    history.push(STUDENT_ROUTE);
                } else { history.push(TEACHER_ROUTE); }
            } else { throw new SyntaxError("Данные некорректны"); }
        } catch (e)
        {
            console.log(e);
            alert(e.message)
        }

    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 54}}
        >
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Авторизация' : "Регистрация"}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control className="mt-3"
                        placeholder="Введите ваш login..."
                        value={login}
                        onChange={e => {setLogin(e.target.value.replaceAll(' ', ''));}}
                    />
                    <Form.Control className="mt-3"
                        placeholder="Введите ваш пароль..."
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value.replaceAll(' ', ''))}
                    />
                    {
                        roles.forEach(r => {
                            <Form.Check className="mt-3" name="group1"
                                label={r.name}
                                value={r.id}
                                onChange={e => {setRoleId(e.target.value); } }
                                type="radio"
                            />
                        })
                    }
                    
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        {
                        isLogin ?
                            <div>
                                Нет аккаунта? <NavLink to={REGISTRATION_ROUTE}>Зарегистрируйся!</NavLink>
                            </div>
                        :
                            <div>
                                Есть аккаунт? <NavLink to={LOGIN_ROUTE}>Войдите!</NavLink>
                            </div>
                        }

                        <Button variant={"outline-success"} onClick={click}>
                            {isLogin ? 'Войти' : 'Регистрация'}
                        </Button>
                    </Row>
                </Form>
            </Card>
        </Container>
    );
});

export default Auth;