const routers = [{
    path: '/',
    meta: {
        title: ''
    },
    component: (resolve) => require(['./views/index.vue'], resolve)
}, {
    path: '/bank_entry',
    meta: {
        title: 'bank_entry'
    },
    component: (resolve) => require(['./views/bank_entry.vue'], resolve)
}, {
    path: '/bank_charge',
    meta: {
        title: 'bank_charge'
    },
    component: (resolve) => require(['./views/bank_charge.vue'], resolve)
}, {
    path: '/ren_entry',
    meta: {
        title: 'ren_entry'
    },
    component: (resolve) => require(['./views/ren_entry.vue'], resolve)
}, {
    path: '/ren_charge',
    meta: {
        title: 'ren_charge'
    },
    component: (resolve) => require(['./views/ren_charge.vue'], resolve)
}, {
    path: '/login',
    meta: {
        title: 'login'
    },
    component: (resolve) => require(['./views/login.vue'], resolve)
}];
export default routers;