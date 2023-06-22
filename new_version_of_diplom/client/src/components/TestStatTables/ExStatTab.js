import React, {useState, useEffect, useContext} from 'react';
import {useHistory} from "react-router-dom";

import {observer} from "mobx-react-lite";

import {Spinner, Row} from "react-bootstrap";

import {BootstrapTable, 
            TableHeaderColumn} from 'react-bootstrap-table';
            import '../../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'

import {getTopicStat} from "../../http/studentAPI";

const ExStatTab = observer(({studentId}) => {
    let [topic, setTopicStat] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(studentId);
        getTopicStat(studentId).then(data => {
            setTopicStat(data);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) { return <Spinner animation={"grow"}/>; }

    return (
        <Row className="d-flex flex-column m-3">
            <details>
                <summary>Статистика по заданиям</summary>
                {
                    <BootstrapTable id="stat_topic" hidden="true" data={topic} options={ { noDataText: 'Нет данных' } }>
                        <TableHeaderColumn isKey dataField='topicId' thStyle={{fontWeight: 'bold', color: 'red'}}>
                            ID
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='user_score'>
                            За все время
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='max_score'>
                            Макс Баллы
                        </TableHeaderColumn>
                        <TableHeaderColumn dataField='last_5'>
                            За последние 10
                        </TableHeaderColumn>
                    </BootstrapTable>
                }
            </details>
        </Row>
    );
});

export default ExStatTab;