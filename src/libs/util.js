import axios from 'axios';
import env from '../config/env';

let util = {

};
util.title = function(title) {
    title = title ? title + ' - Home' : '人民币账户影像传输系统';
    window.document.title = title;
};

// const ajaxUrl = env === 'development' ?
//     'http://' + location.hostname + ':' + '8888' + '/api':
//     env === 'production' ?
//         'http://' + location.host + '/api' :
//         'https://debug.url.com';
//
// util.ajax = axios.create({
//     baseURL: ajaxUrl,
//     timeout: 5000
// });

util.getRouterObjByName = function (routers, name) {
    if (!name || !routers || !routers.length) {
        return null;
    }
    // debugger;
    let routerObj = null;
    for (let item of routers) {
        if (item.name === name) {
            return item;
        }
        routerObj = util.getRouterObjByName(item.children, name);
        if (routerObj) {
            return routerObj;
        }
    }
    return null;
};

util.toDefaultPage = function (routers, name, route, next ,level) {
    let len = routers.length;
    let i = 0;
    let notHandle = true;
    while (i < len) {
        if (routers[i].name === name && routers[i].children && routers[i].redirect === undefined) {

            if (name === 'mainRouter'){
                var toName = '';
                switch (level){
                    case '1': toName = 'bank_entry';
                        break;
                    case '2': toName = 'bank_review';
                        break;
                    case '3': toName = 'bank_charge';
                        break;
                    case '4': toName = 'ren_entry';
                        break;
                    case '5': toName = 'ren_recheck';
                        break;
                    case '6': toName = 'ren_charge';
                        break;
                    case '7': toName = 'query';
                        break;
                }
                route.replace({
                    name: toName
                });
            } else {
                route.replace({
                    name: routers[i].children[0].name
                });
            }
            notHandle = false;
            next();
            break;
        }
        i++;
    }
    if (notHandle) {
        next();
    }
};

export default util;
