import React, {useContext, useLocation, useEffect, useState} from 'react';
import {BrowserRouter} from 'react-router-dom';

import {observer} from "mobx-react-lite";

import {Spinner} from "react-bootstrap";

import {Context} from "./index";
import {check} from "./http/userAPI";

import AppRouter from './components/AppRouter';
import NavBar from './components/NavBar';

const App = observer(() => {
  let {user} = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    check().then(data => {
        user.setData(data);
        user.setIsAuth(true);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) { return <Spinner animation={"grow"}/> }

  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
    </BrowserRouter>
  );
});

export default App;
