import React, {useContext} from 'react';
import {Switch, Route, Redirect} from 'react-router-dom'

import {observer} from "mobx-react-lite";

import {Context} from "../index";

import {teacherRouter,
        studentRouter,
        adminRouter,
        publicRouter} from '../routes';
import {LOGIN_ROUTE} from '../utils/consts';

const AppRouter = observer(() => {
    const {user} = useContext(Context);

    console.log('AppRouter', user.data.roleId);

    return (
        <Switch>
            {user.data.roleId == 3 && teacherRouter.map(({path, Component}) =>
                <Route key={path} path={path} component={Component} exact/>
            )};
            {user.data.roleId == 2 && studentRouter.map(({path, Component}) =>
                <Route key={path} path={path} component={Component} exact/>
            )};
            {user.data.roleId == 1 && adminRouter.map(({path, Component}) =>
                <Route key={path} path={path} component={Component} exact/>
            )};
            {publicRouter.map(({path, Component}) =>
                <Route key={path} path={path} component={Component} exact/>
            )};
        </Switch>
    );
});

export default AppRouter;