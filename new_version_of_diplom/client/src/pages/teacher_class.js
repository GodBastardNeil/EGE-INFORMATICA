import React, {useContext, useState, useEffect} from 'react';

import {observer} from "mobx-react-lite";

import {Spinner, Container, Row, Button, ButtonGroup} from "react-bootstrap";

import {BootstrapTable, 
            TableHeaderColumn} from 'react-bootstrap-table';

import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'

import {Context} from "../index";

import {add_to_class, delete_from_class, getStudents} from "../http/classAPI";

const TeacherClass = observer(() => {
    const {user} = useContext(Context);
    console.log('User: ', user);

    const [students, setStudent] = useState([]);
    const [request, setRequest] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getStudents().then(data => {
            setStudent(data[0]);
            setRequest(data[1]);
            console.log(data);
        }).finally(() => setLoading(false))
    }, []);

    if (loading) { return <Spinner animation={"grow"}/> }

    function fun1(row) {
        console.log(row.id, row.login, row.email);

        setStudent(students.filter(item => item != row));

        delete_from_class(user.data.id, row.id);
    }
    function fun2(row) {
        console.log(row.id, row.login, row.email);

        setRequest(request.filter(item => item != row));
        students.push({id: row.id, login: row.login, email: row.email});

        add_to_class(user.data.id, row.id);
    }
    function fun3(row) {
        console.log(row.id, row.login, row.email);

        setRequest(request.filter(item => item != row));

        delete_from_class(user.data.id, row.id);
    }

    const DeleteFromClass = (cell, row) =>
    {
        return (
            <Button onClick={() => { fun1(row); }} >
                &#128465;
            </Button>
        );
    }
    const WorkWithRequest = (cell, row) =>
    {
        return (
            <ButtonGroup>
                <Button title="Добавить" onClick={() => { fun2(row); }} >
                    &#128190;
                </Button>
                <Button title="Удалить"  onClick={() => { fun3(row); }} >
                    &#128465;
                </Button>
            </ButtonGroup>
        );
    }

    return (
        <Container className="mt-3">
            <Row className="d-flex flex-column m-3">
                <h4>Список Ваших Учителей</h4>
                <div>
                    <BootstrapTable data={students} height='240' scrollTop={ 'Bottom' }
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
                        <TableHeaderColumn dataField="button" dataFormat={WorkWithRequest}>
                            Обработка заявок
                        </TableHeaderColumn>
                    </BootstrapTable>
                </div>
            </Row>
        </Container>
    );
});
export default TeacherClass;