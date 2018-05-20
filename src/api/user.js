import request from '../utils/request';

export function getUSer(data) {
    return request({
        url: '/user/user',
        method: 'get',
        params: data
    });
}

export function addUser(data) {
    return request({
        url: '/user/user',
        method: 'post',
        headers: {'Content-Type':'application/json'},
        data
    });
}

export function updateUser(data) {
    return request({
        url: '/user/userInfo',
        method: 'post',
        headers: {'Content-Type':'application/json'},
        data
    });
}
