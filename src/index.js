import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';
import { BrowserRouter } from 'react-router-dom'


var config = {
    apiKey: "AIzaSyC0Be1R4pd4NkTF8xtcMrT4Jj5aW84W2uY",
    authDomain: "niiceme-6be02.firebaseapp.com",
    databaseURL: "https://niiceme-6be02.firebaseio.com",
    projectId: "niiceme-6be02",
    storageBucket: "niiceme-6be02.appspot.com",
    messagingSenderId: "755983652018"
};

firebase.initializeApp(config);


ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
