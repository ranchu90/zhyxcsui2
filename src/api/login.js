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
