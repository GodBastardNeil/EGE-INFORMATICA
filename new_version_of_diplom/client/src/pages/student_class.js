import React, {useContext, useState, useEffect} from 'react';

import {observer} from "mobx-react-lite";

import {Spinner, Container, Row, Button} from "react-bootstrap";

import {BootstrapTable, 
            TableHeaderColumn} from 'react-bootstrap-table';

import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'

import {Context} from "../index";

import {add_to_request, delete_from_class, getTeachers} from "../http/classAPI";

const StudentClass = observer(() => {
    const {user} = useContext(Context);
    console.log('User: ', user);

    const [teachers, setTeachers] = useState([]);
    const [request, setRequest] = useState([]);
    const [all_teachers, setATeachers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTeachers().then(data => {
            setTeachers(data[0]);
            setRequest(data[1]);
            setATeachers(data[2]);
            console.log(data);
        }).finally(() => setLoading(false))
    }, []);

    if (loading) { return <Spinner animation={"grow"}/> }

    function fun1(row) {
        console.log(row.id, row.login, row.email);

        setTeachers(teachers.filter(item => item != row));
        all_teachers.push({id: row.id, login: row.login, email: row.email});

        delete_from_class(user.data.id, row.id);
    }
    function fun2(row) {
        console.log(row.id, row.login, row.email);

        setRequest(request.filter(item => item != row));
        all_teachers.push({id: row.id, login: row.login, email: row.email});

        delete_from_class(user.data.id, row.id);
    }
    function fun3(row) {
        console.log(row.id, row.login, row.email);

        setATeachers(all_teachers.filter(item => item != row));
        request.push({id: row.id, login: row.login, email: row.email});

        add_to_request(user.data.id, row.id);
    }

    const DeleteFromClass = (cell, row) =>
    {
        return (
            <Button onClick={() => { fun1(row); }} >
                &#128465;
            </Button>
        );
    }
    const DeleteFromRequest = (cell, row) =>
    {
        return (
            <Button onClick={() => { fun2(row); }} >
                &#128465;
            </Button>
        );
    }
    const AddToRequest = (cell, row) =>
    {
        return (
            <Button onClick={() => { fun3(row); }} >
                &#128190;
            </Button>
        );
    }

    return (
        <Container className="mt-3">
            <Row className="d-flex flex-column m-3">
                <h4>Список Ваших Учителей</h4>
                <div>
                    <BootstrapTable data={teachers} height='240' scrollTop={ 'Bottom' }
                                    options={ { noDataText: 'Нет данных' } }
                    >
                        <TableHeaderColumn isKey dataField='id' thStyle={{fontWeight: 'bold', color: 'red'}}>
                            Id
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='email'>
                            Email
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='login'>
                            Login
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField="button" dataFormat={DeleteFromClass}>
                            Прекратить Обучение
                        </TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </Row>
            <Row className="d-flex flex-column m-3">
                <h4>Список Запросов На Преподавание</h4>
                <div>
                    <BootstrapTable data={request} height='240' scrollTop={ 'Bottom' }
                                    options={ { noDataText: 'Нет данных' } }
                    >
                        <TableHeaderColumn isKey dataField='id' thStyle={{fontWeight: 'bold', color: 'red'}}>
                            Id
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='email'>
                            Email
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='login'>
                            Login
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField="button" dataFormat={DeleteFromRequest}>
                            Прекратить Обучение
                        </TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </Row>
            <Row className="d-flex flex-column m-3">
                <h4>Список Всех Учителей</h4>
                <div>
                    <BootstrapTable data={all_teachers} height='240' scrollTop={ 'Bottom' }
                                    options={ { noDataText: 'Нет данных' } }
                    >
                        <TableHeaderColumn isKey dataField='id' thStyle={{fontWeight: 'bold', color: 'red'}}>
                            Id
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='email'>
                            Email
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='login'>
                            Login
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField="button" dataFormat={AddToRequest}>
                            Отправить Заявку
                        </TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </Row>
        </Container>
    );
});
export default StudentClass;