import request from '../utils/request';

export function businessCategory() {
    return request({
        url: '/images/businessCategory',
        method: 'get',
        headers: {'Content-Type':'application/json'}
    });
}

export function accountType() {
    return request({
        url: '/images/accountType',
        method: 'get',
        headers: {'Content-Type':'application/json'}
    });
}

export function certificateType(data) {
    return request({
        url: '/images/certificateType',
        method: 'get',
        params:data
    });
}
