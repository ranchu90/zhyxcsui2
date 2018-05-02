import Vue from 'vue';
import iView from 'iview';
import {router} from './routers/index';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import Axios from 'axios';
import store from './store';

// 配置请求信息
var $http = Axios.create({
    baseURL: 'http://localhost:8888',
    timeout: '3000',  //请求超时时间
    headers: {'Content-Type':'application/json'}     //header传值，例如：Authorization
});

Vue.prototype.$http = $http;

Vue.use(iView);

require('es6-promise').polyfill();

new Vue({
    el: '#app',
    store,
    router: router,
    render: h => h(App)
});
