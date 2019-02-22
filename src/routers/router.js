import Main from '../views/Main';
import SVMain from '../views/SVMain'

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: resolve => { require(['../views/login.vue'], resolve); }
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: resolve => { require(['../views/error-page/404.vue'], resolve); }
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: resolve => { require(['../views/error-page/403.vue'], resolve); }
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: resolve => { require(['../views/error-page/500.vue'], resolve); }
};

// 非企业类
// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const mainRouter = {
    path: '/',
    name: 'mainRouter',
    meta: {
        requireAuth:true,
    },
    component: Main,
    children: [
        {
            path: 'bank_entry',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'bank_entry'},
            access:['1'],
            name: 'bank_entry',
            component: resolve => { require(['../views/pages/oldPages/bank_entry.vue'], resolve);
            }
        },
        {
            path: 'bank_review',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'bank_review'},
            access:['2'],
            name: 'bank_review',
            component: resolve => { require(['../views/pages/oldPages/bank_review.vue'], resolve);
            }
        },
        {
            path: 'bank_charge',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'bank_charge'},
            access:['3', '7'],
            name: 'bank_charge',
            component: resolve => { require(['../views/pages/oldPages/bank_charge.vue'], resolve);
            }
        },
        {
            path: 'ren_entry',
            meta: {
                requireAuth:true,
            },
            title: {i18n: 'ren_entry'},
            access:['4'],
            name: 'ren_entry',
            component: resolve => { require(['../views/pages/oldPages/ren_entry.vue'], resolve);
            }
        },
        {
            path: 'ren_recheck',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'ren_recheck'},
            access:['5'],
            name: 'ren_recheck',
            component: resolve => { require(['../views/pages/oldPages/ren_recheck.vue'], resolve);
            }
        },
        {
            path: 'ren_charge',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'ren_charge'},
            access:['6', '7'],
            name: 'ren_charge',
            component: resolve => { require(['../views/pages/oldPages/ren_charge.vue'], resolve);
            }
        },
        {
            path: 'system_log',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'system_log'},
            access:['7'],
            name: 'system_log',
            component: resolve => { require(['../views/pages/oldPages/system_log.vue'], resolve);
            }
        },
        {
            path: 'query',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'query'},
            access:['1','2','4','5','7'],
            name: 'query',
            component: resolve => { require(['../views/pages/oldPages/query.vue'], resolve);
            }
        },
        {
            path: 'statistic',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'statistic'},
            access:['1','2','3','4','5','6','7'],
            name: 'statistic',
            component: resolve => { require(['../views/pages/oldPages/statistic.vue'], resolve);
            }
        },
        {
            path: 'orga',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'statistic'},
            access:['7'],
            name: 'orga-manage',
            component: resolve => { require(['../views/pages/oldPages/orga.vue'], resolve);
            }
        }
    ]
};

//企业类
// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const svMainRouter = {
    path: '/SV',
    name: 'svMainRouter',
    meta: {
        requireAuth:true,
    },
    component: SVMain,
    children: [
        {
            path: 'sv_bank_entry',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'sv_bank_entry'},
            access:['1'],
            name: 'sv_bank_entry',
            component: resolve => { require(['../views/pages/newPages/sv_bank_entry.vue'], resolve);
            }
        },
        {
            path: 'sv_bank_review',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'sv_bank_review'},
            access:['2'],
            name: 'sv_bank_review',
            component: resolve => { require(['../views/pages/newPages/sv_bank_review.vue'], resolve);
            }
        },
        {
            path: 'sv_bank_charge',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'sv_bank_charge'},
            access:['3', '7'],
            name: 'sv_bank_charge',
            component: resolve => { require(['../views/pages/newPages/sv_bank_charge.vue'], resolve);
            }
        },
        {
            path: 'sv_ren_entry',
            meta: {
                requireAuth:true,
            },
            title: {i18n: 'ren_entry'},
            access:['4'],
            name: 'sv_ren_entry',
            component: resolve => { require(['../views/pages/newPages/sv_ren_entry.vue'], resolve);
            }
        },
        {
            path: 'sv_ren_recheck',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'sv_ren_recheck'},
            access:['5'],
            name: 'sv_ren_recheck',
            component: resolve => { require(['../views/pages/newPages/sv_ren_recheck.vue'], resolve);
            }
        },
        {
            path: 'sv_ren_charge',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'sv_ren_charge'},
            access:['6', '7'],
            name: 'sv_ren_charge',
            component: resolve => { require(['../views/pages/newPages/sv_ren_charge.vue'], resolve);
            }
        },
        {
            path: 'sv_system_log',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'sv_system_log'},
            access:['7'],
            name: 'sv_system_log',
            component: resolve => { require(['../views/pages/newPages/system_log.vue'], resolve);
            }
        },
        {
            path: 'sv_query',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'sv_query'},
            access:['1','2','4','5','7'],
            name: 'sv_query',
            component: resolve => { require(['../views/pages/newPages/query.vue'], resolve);
            }
        },
        {
            path: 'sv_statistic',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'sv_statistic'},
            access:['1','2','3','4','5','6','7'],
            name: 'sv_statistic',
            component: resolve => { require(['../views/pages/newPages/statistic.vue'], resolve);
            }
        },
        {
            path: 'sv_orga',
            meta: {
                requireAuth:true
            },
            title: {i18n: 'sv_statistic'},
            access:['7'],
            name: 'sv_orga-manage',
            component: resolve => { require(['../views/pages/newPages/orga.vue'], resolve);
            }
        }
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里


// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    mainRouter,
    svMainRouter,
    page500,
    page403,
    page404
];
