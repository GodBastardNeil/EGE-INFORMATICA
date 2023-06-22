import React, {useState, useEffect, useContext} from 'react';
import {useHistory} from "react-router-dom";

import {observer} from "mobx-react-lite";

import {Spinner, Row, Button} from "react-bootstrap";

import {BootstrapTable, 
            TableHeaderColumn} from 'react-bootstrap-table';
import '../../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'

import {Context} from "../../index";

import {getTeacherTests} from "../../http/studentAPI";

import {TEST_ROUTE, STAT_ROUTE} from '../../utils/consts';

const TeachTestTab = observer(({studentId}) => {
    let {user} = useContext(Context);
    let [teach, setTeachStat] = useState();
    const history = useHistory();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTeacherTests(studentId).then(data => {
            setTeachStat(data);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) { return <Spinner animation={"grow"}/>; }

    const TeachButtons = (cell, row) =>
    {
        if (user.data.roleId == 3)
        {
            return (
                <Button onClick={() => history.push(STAT_ROUTE + `/${row.testId}/${studentId}`)}>
                    Статистика
                </Button>
            );
        } else
        {
            return (
                <Button onClick={() => history.push(TEST_ROUTE + '/' + row.testId)}>
                    Тест
                </Button>
            );
        }
    }

    return (
        <Row id='stat_tables' className="d-flex flex-column m-3">
            <details>
                <summary>Статистика по тестам преподавателей</summary>
                {
                    <BootstrapTable id="stat_teach" hidden="true" data={teach} options={ { noDataText: 'Нет данных' } }>
                        <TableHeaderColumn isKey dataField='id' thStyle={{fontWeight: 'bold', color: 'red'}}>
                            ID
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='task_score'>
                            Количество задний
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='user_scores'>
                            Баллы Пользователя
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='max_score'>
                            Макс Баллы
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='dates'>
                            Даты
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField="button" dataFormat={TeachButtons}>
                            Действия
                        </TableHeaderColumn>
                    </BootstrapTable>
                }
            </details>
        </Row>
    );
});

export default TeachTestTab;