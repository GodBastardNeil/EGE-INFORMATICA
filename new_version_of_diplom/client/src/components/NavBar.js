import React, {useContext} from 'react';
import {useLocation, useHistory} from "react-router-dom";

import {observer} from "mobx-react-lite";

import {Navbar, Nav, Button, Container} from "react-bootstrap";

import {Context} from "../index";
import {logout} from "../http/userAPI";

import {TEACHER_ROUTE,
        STUDENT_ROUTE,
        TCLASS_ROUTE,
        SCLASS_ROUTE,
        LOGIN_ROUTE,
        REGISTRATION_ROUTE,
        TOPIC_ROUTE} from '../utils/consts';


const NavBar = observer(() => {
    let {user} = useContext(Context);
    const history = useHistory();
    const location = useLocation();

    console.log('NavBar', user.data.login);

    let isLogin = (location.pathname === LOGIN_ROUTE);

    const logOut = async () => {
        await logout();
        user.setData({});
        user.setIsAuth(false);
    }
  
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                {
                    (location.pathname.indexOf('admin') != -1) ?
                        (!user.isAuth) ?
                            <></>
                        :
                            <Button variant={"outline-light"} onClick={logOut} className="ml-2"> Выйти </Button>
                    :
                        (!user.isAuth) ?
                            (isLogin) ?
                                <Nav className="ml-auto" style={{color: 'white'}}>
                                    <Button variant={"outline-light"} onClick={() => history.push(REGISTRATION_ROUTE)}> Регистрация </Button>
                                </Nav>
                            :
                                <Nav className="ml-auto" style={{color: 'white'}}>
                                    <Button variant={"outline-light"} onClick={() => history.push(LOGIN_ROUTE)}> Авторизация </Button>
                                </Nav>
                        :
                            <Nav className="ml-auto" style={{color: 'white'}}>
                                <Button variant={"outline-light"}
                                    onClick = {() => history.push(
                                        (user.data.roleId == 2) ? STUDENT_ROUTE : TEACHER_ROUTE
                                    )}
                                >
                                    Главная
                                </Button>
                                <Button variant={"outline-light"}
                                    onClick = {() => history.push(
                                        (user.data.roleId == 2) ? SCLASS_ROUTE : TCLASS_ROUTE
                                    )}
                                >
                                    Класс
                                </Button>

                                <Button variant={"outline-light"}
                                    onClick = {() => history.push(TOPIC_ROUTE)}
                                >
                                    Темы
                                </Button>

                                <Button variant={"outline-light"} onClick={logOut} className="ml-2"> Выйти </Button>
                            </Nav>
                }
            </Container>
        </Navbar>
    );
});
  
  export default NavBar;