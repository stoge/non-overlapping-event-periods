import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';
import store from './stores/eventStore'
import App from './App';


ReactDOM.render(
  <Provider events={store}>
    <App/>
  </Provider>
  , document.getElementById('root'));
