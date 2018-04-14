import {init as appInit} from './app.js';
import FastClick from 'fastclick'

//FastClick.attach(document.body);

appInit({
    mountPointID: '#app',
    routerMode: 'hash'
});


