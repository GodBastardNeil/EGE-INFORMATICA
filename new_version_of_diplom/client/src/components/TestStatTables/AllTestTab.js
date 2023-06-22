import React, {useState, useEffect, useContext} from 'react';
import {useHistory} from "react-router-dom";

import {observer} from "mobx-react-lite";

import {Spinner, Row, Button, ButtonGroup} from "react-bootstrap";

import {BootstrapTable, 
            TableHeaderColumn} from 'react-bootstrap-table';
            import '../../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'

import {Context} from "../../index";

import {getTestStat} from "../../http/studentAPI";

import {TEST_ROUTE, STAT_ROUTE} from '../../utils/consts';

const AllTestTab = observer(({studentId}) => {
    let {user} = useContext(Context);
    let [test, setTestStat] = useState();
    const history = useHistory();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTestStat(studentId).then(data => {
            setTestStat(data);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) { return <Spinner animation={"grow"}/>; }

    const TestButtons = (cell, row) =>
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
                <ButtonGroup>
                    <Button onClick= {() => history.push(TEST_ROUTE + '/' + row.testId)}>
                        Тест
                    </Button>
                    <Button onClick= {() => history.push(STAT_ROUTE + `/${row.testId}/${studentId}`)}>
                        Статистика
                    </Button>
                </ButtonGroup>
            );
        }
    }

    return (
        <Row className="d-flex flex-column m-3">
            <details>
                <summary>Статистика по всем тестам</summary>
                {
                    <BootstrapTable id="stat_test" hidden="true" data={test} options={ { noDataText: 'Нет данных' } }>
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
                        <TableHeaderColumn dataField="button" dataFormat={TestButtons}>
                            Действия
                        </TableHeaderColumn>
                    </BootstrapTable>
                }
            </details>
        </Row>
    );
});

export default AllTestTab;