import React, {useState, useEffect} from 'react';
import {useParams, useLocation, useHistory} from "react-router-dom";

import {observer} from "mobx-react-lite";

import {Spinner, Container, Button, ButtonGroup, Row} from "react-bootstrap";

import {BootstrapTable, 
            TableHeaderColumn} from 'react-bootstrap-table';

import '../../node_modules/react-bootstrap-table/css/react-bootstrap-table.css'

import {fetchTopic, fetchType, fetchTemplate, getTopicId,
        Reset,
        SaveTopic, SaveType,
        ChangeTopic, ChangeType,
        ActiveTopic, ActiveType, ActiveTemplate} from "../http/adminAPI";

import {ADMIN_TOPIC_ROUTE,
        ADMIN_TYPE_ROUTE,
        ADMIN_TEMPLATE_ROUTE,
        TEMPLATE_ROUTE} from '../utils/consts';

const Admin = observer(() => {
    const Id = useParams().Id;
    const location = useLocation();
    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);
    const history = useHistory();

    const [info, setInfo] = useState([]);
    const [unact, setUnact] = useState([]);

    const [topicId, setTopicId] = useState(0);

    let loc = location.pathname;

    useEffect(() => {
        if (loc.indexOf(ADMIN_TOPIC_ROUTE) != -1)
        {
            fetchTopic().then(data => {
                setInfo(data[0]);
                setUnact(data[1]);
            }).finally(() => {setLoading1(false); setLoading2(false)});
        } else if (loc.indexOf(ADMIN_TYPE_ROUTE) != -1)
        {
            fetchType(Id).then(data => {
                setInfo(data[0]);
                setUnact(data[1]);
            }).finally(() => {setLoading1(false); setLoading2(false)});
        } else if (loc.indexOf(ADMIN_TEMPLATE_ROUTE) != -1)
        {
            fetchTemplate(Id).then(data => {
                setInfo(data[0]);
                setUnact(data[1]);
            }).finally(() => setLoading1(false));
            getTopicId(Id).then(data => {
                setTopicId(data.topicId);
            }).finally(() => setLoading2(false));
        }
    }, []);

    if (loading1 || loading2) { return <Spinner animation={"grow"}/> }

    async function delete_from_info(row)
    {
        try {
            console.log(row.id, row.title);

            if (loc.indexOf(ADMIN_TOPIC_ROUTE) != -1)
            {
                await ActiveTopic(row.id, false).then(b => {
                    if (b)
                    {
                        setInfo(info.filter(item => item != row));
                        unact.push({id: row.id, title: row.title});
                        return true;
                    } else { alert('Не может быть активирована'); return false; }
                });
            } else if (loc.indexOf(ADMIN_TYPE_ROUTE) != -1)
            {
                await ActiveType(row.id, false).then(b => {
                    if (b)
                    {
                        setInfo(info.filter(item => item != row));
                        unact.push({id: row.id, title: row.title});
                        return true;
                    } else { alert('Не может быть активирована'); return false; }
                });
            } else if (loc.indexOf(ADMIN_TEMPLATE_ROUTE) != -1)
            {
                await ActiveTemplate(row.id, false).then(b => {
                    if (b)
                    {
                        setInfo(info.filter(item => item != row));
                        unact.push({id: row.id, title: row.title});
                        return true;
                    } else { alert('Не может быть активирована'); return false; }
                });
            }
        } catch (e) { console.log(e.message); alert(e.message); }
    }
    async function add_to_info(row)
    {
        try {
            console.log(row.id);

            if (loc.indexOf(ADMIN_TOPIC_ROUTE) != -1)
            {
                let b = await ActiveTopic(row.id, true)
                console.log(b);
                if (b)
                {
                    setUnact(unact.filter(item => item != row));
                    info.push({id: row.id});
                } else { alert('Не может быть активирована'); }
                return b;
            } else if (loc.indexOf(ADMIN_TYPE_ROUTE) != -1)
            {
                let b = await ActiveType(row.id, true)
                console.log(b);
                if (b)
                {
                    setUnact(unact.filter(item => item != row));
                    info.push({id: row.id});
                } else { alert('Не может быть активирована'); }
                return b;
            } else if (loc.indexOf(ADMIN_TEMPLATE_ROUTE) != -1)
            {
                let b = await ActiveTemplate(row.id, true)
                console.log(b);
                if (b)
                {
                    setUnact(unact.filter(item => item != row));
                    info.push({id: row.id});
                } else { alert('Не может быть активирована'); }
                return b;
            }
        } catch (e) { console.log(e.message); alert(e.message); return false; }
    }
    async function save_(row, cellName, cellValue)
    {
        try {
            if (loc.indexOf(ADMIN_TOPIC_ROUTE) != -1)
            {
                await ChangeTopic(row.id, cellValue).then(b => {
                    if (b)
                    {
                        return true;
                    } else { alert('Имя занято'); return false; }
                });
            } else if (loc.indexOf(ADMIN_TYPE_ROUTE) != -1)
            {
                await ChangeType(row.id, cellValue).then(b => {
                    if (b)
                    {
                        return true;
                    } else { alert('Имя занято'); return false; }
                });
            }
        } catch (e) { console.log(e.message); alert(e.message); return false; }
    }

    const IActions = (cell, row) =>
    {
        if (loc.indexOf(ADMIN_TOPIC_ROUTE) != -1)
        {
            return (
                <ButtonGroup>
                    <Button title="Удалить" onClick={() => { delete_from_info(row); }} >
                        &#128465;
                    </Button>
                    <Button title="Перегрузить" onClick={() => {  Reset(row.id); }} >
                        &#128259;
                    </Button>
                    <Button title="Перейти к типам" onClick={() => { history.push(ADMIN_TYPE_ROUTE + '/' + row.id); }} >
                        &#128451;
                    </Button>
                </ButtonGroup>
            );
        } else if (loc.indexOf(ADMIN_TYPE_ROUTE) != -1)
        {
            return (
                <ButtonGroup>
                    <Button title="Удалить" onClick={() => { delete_from_info(row); }} >
                        &#128465;
                    </Button>
                    <Button title="Перейти к шаблонам" onClick={() => { history.push(ADMIN_TEMPLATE_ROUTE + '/' + row.id); }} >
                        &#128451;
                    </Button>
                </ButtonGroup>
            );
        } else if (loc.indexOf(ADMIN_TEMPLATE_ROUTE) != -1)
        {
            return (
                <ButtonGroup>
                    <Button title="Удалить" onClick={() => { delete_from_info(row); }} >
                        &#128465;
                    </Button>
                    <Button title="Редактировать" onClick={() => { history.push(TEMPLATE_ROUTE + `/${Id}/${row.id}`); }} >
                        &#128209;
                    </Button>
                </ButtonGroup>
            );
        }
    }
    const UActions = (cell, row) =>
    {
        if (loc.indexOf(ADMIN_TOPIC_ROUTE) != -1)
        {
            return (
                <ButtonGroup>
                    <Button title="Активировать" onClick={() => { add_to_info(row); }} >
                        &#10133;
                    </Button>
                    <Button title="Перегрузить" onClick={() => {  Reset(row); }} >
                        &#128259;
                    </Button>
                    <Button title="Перейти к типам" onClick={() => { history.push(ADMIN_TYPE_ROUTE + '/' + row.id); }} >
                        &#128451;
                    </Button>
                </ButtonGroup>
            );
        } else if (loc.indexOf(ADMIN_TYPE_ROUTE) != -1)
        {
            return (
                <ButtonGroup>
                    <Button title="Активировать" onClick={() => { add_to_info(row); }} >
                        &#10133;
                    </Button>
                    <Button title="Перейти к шаблонам" onClick={() => { history.push(ADMIN_TEMPLATE_ROUTE + '/' + row.id); }} >
                        &#128451;
                    </Button>
                </ButtonGroup>
            );
        } else if (loc.indexOf(ADMIN_TEMPLATE_ROUTE) != -1)
        {
            return (
                <ButtonGroup>
                    <Button title="Активировать" onClick={() => { add_to_info(row); }} >
                        &#10133;
                    </Button>
                    <Button title="Редактировать" onClick={() => { history.push(TEMPLATE_ROUTE + `/${Id}/${row.id}`); }} >
                        &#128209;
                    </Button>
                </ButtonGroup>
            );
        }
    }

    async function AddRow(row)
    {
        try {
            console.log(row.id, row.title);
    
            if (loc.indexOf(ADMIN_TOPIC_ROUTE) != -1)
            {
                await SaveTopic(row.id, row.title, false).then(b => {
                    if (b)
                    {
                        unact.push({id: row.id, title: row.title});
                        return true;
                    } else { alert('Не может быть создано'); return false; }
                });
            } else if (loc.indexOf(ADMIN_TYPE_ROUTE) != -1)
            {
                await SaveType(row.id, Id, row.title, false).then(b => {
                    if (b)
                    {
                        unact.push({id: row.id, title: row.title});
                        return true;
                    } else { alert('Не может быть создано'); return false; }
                });
            }
        } catch (e) { console.log(e.message); alert(e.message); return false; }
    }


    return (
        <Container className="mt-3">
            <Row className="d-flex flex-column m-3">
                <h4>Админ Панель</h4>
                {
                    (loc.indexOf(ADMIN_TEMPLATE_ROUTE) == -1) ?
                        (loc.indexOf(ADMIN_TYPE_ROUTE) == -1) ?
                            <h5> Все Темы </h5>
                        :
                            <Button onClick={() => history.push(ADMIN_TOPIC_ROUTE + '/0')}>Перейти к темам</Button>
                    :
                        <Button onClick={() => history.push(ADMIN_TYPE_ROUTE + '/' + topicId)}>Перейти к типам</Button>
                }
            </Row>
            <Row className="d-flex flex-column m-3">
                <h6>Активные</h6>
                <BootstrapTable data={info} height='240' scrollTop={ 'Bottom' }
                                options={ { noDataText: 'Нет данных' } } cellEdit={ { mode: 'click', beforeSaveCell: save_ } }
                >
                    <TableHeaderColumn isKey dataField='id' thStyle={{fontWeight: 'bold', color: 'red'}}>
                        Id
                    </TableHeaderColumn>
                    {
                            (loc.indexOf(ADMIN_TEMPLATE_ROUTE) == -1) ?
                                <TableHeaderColumn dataField='title'>
                                    Title
                                </TableHeaderColumn>
                            :
                                <></>
                    }
                    <TableHeaderColumn dataField="button" editable={ false } dataFormat={IActions}>
                        -
                    </TableHeaderColumn>
                </BootstrapTable>
            </Row>
            <Row className="d-flex flex-column m-3">
                <h6>Не активные</h6>
                <BootstrapTable data={unact} height='240' scrollTop={ 'Bottom' } options={ { noDataText: 'Нет данных', insertText: 'Добавить', beforeInsertRow: AddRow } }
                                insertRow={ (loc.indexOf(ADMIN_TEMPLATE_ROUTE) == -1) ? true : false } cellEdit={ { mode: 'click', beforeSaveCell: save_ } }
                >
                    <TableHeaderColumn isKey dataField='id' thStyle={{fontWeight: 'bold', color: 'red'}}>
                        Id
                    </TableHeaderColumn>
                    {
                            (loc.indexOf(ADMIN_TEMPLATE_ROUTE) == -1) ?
                                <TableHeaderColumn dataField='title'>
                                    Title
                                </TableHeaderColumn>
                            :
                                <></>
                    }
                    <TableHeaderColumn dataField="button" editable={ false } dataFormat={UActions}>
                        -
                    </TableHeaderColumn>
                </BootstrapTable>
            </Row>
            <Row className="d-flex flex-column m-3">
                {
                    (loc.indexOf(ADMIN_TEMPLATE_ROUTE) != -1) ?
                        <Button onClick={() => { history.push(TEMPLATE_ROUTE + `/${Id}/-1`); }} >
                            Добавить
                        </Button>
                    :
                        <></>
                }
            </Row>
        </Container>
    );
});

export default Admin;