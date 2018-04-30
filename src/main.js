import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import Axios from 'axios';

// 配置请求信息
var $http = Axios.create({
    baseURL: 'http://192.168.2.101:8888',
    timeout: '3000',  //请求超时时间
    headers: {'Content-Type':'application/json'}     //header传值，例如：Authorization
});

Vue.prototype.$http = $http;

Vue.use(VueRouter);


Vue.use(iView);



// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});



new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});