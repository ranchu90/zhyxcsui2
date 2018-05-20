import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import {routers, mainRouter} from './router';
import VueRouter from 'vue-router';
import store from '../store';
import Cookies from 'js-cookie';

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
        //判断用户是否登陆
        if (store.state.user.user) {
            const curRouterObj = Util.getRouterObjByName([mainRouter], to.name);
            var cookie = JSON.parse(Cookies.get('user'));
            var level = cookie.userlevel;

            if (curRouterObj && curRouterObj.access !== undefined){
                let accessList = curRouterObj.access;
                var hasPermission = false;

                //控制访问权限
                hasPermission = accessList.includes(level);

                if (hasPermission) {
                    next();
                } else {
                    next({path:'/403', replace: true});
                }
            } else {
                Util.toDefaultPage([...routers], to.name, router, next, level);
                // next();
            }

        } else {
            next({
                path: '/login',
                query: {redirect:to.fullPath}
            });
        }
    } else {
        if (store.state.user.user && to.name === 'login'){
            next({
                name: 'mainRouter'
            });
        } else {
            next();
        }
    }
});

router.afterEach(() => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
