import React, { createContext } from 'react';
import ReactDOM from 'react-dom';

import App from './App';

import UserStore from "./store/UserStore";
import TempStore from "./store/TempStore";

export const Context = createContext(null);

ReactDOM.render(
  <Context.Provider value={{
    user: new UserStore(),
    temp: new TempStore()
  }}>
    <App />
  </Context.Provider>,
  document.getElementById('root')
);
