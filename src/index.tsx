import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import './index.css';
import App from './App';
import IpfsStore from './stores/ipfs-store';
import Web3Store from './stores/web3-store';
import * as serviceWorker from './serviceWorker';

import { ToastProvider } from 'react-toast-notifications';


ReactDOM.render(
  <Router>
    <ToastProvider placement="bottom-left" autoDismissTimeout={3000}>
      <Provider ipfsStore ={new IpfsStore()} web3Store={new Web3Store()}>
        <App/>
      </Provider>
    </ToastProvider>
  </Router>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
