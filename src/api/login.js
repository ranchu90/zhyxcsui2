import request from '../utils/request';

export function login(usercode, password) {
    const data = {
        susercode: usercode,
        spassword: password
    };
    return request({
        url: '/login/verify',
        method: 'post',
        headers: {'Content-Type':'application/json'},
        data
    });
}

export function logout() {
    return request({
        url: '/login/logout',
        method: 'post'
    });
}

export function forceLogout(usercode) {
    const data = {
        userCode: usercode
    };
    return request({
        url: '/login/force_logout',
        method: 'post',
        params:data
    });
}
