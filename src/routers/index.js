import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import {routers} from './router';
import VueRouter from 'vue-router';
import store from '../store';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    mode: 'hash',
    routes: routers
};

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);

    if (to.meta.requireAuth) {
        if (store.state.user.user) {
            next();
        } else {
            next({
                path: '/login',
                query: {redirect:to.fullPath}
            });
        }
    } else {
        next();
    }
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
