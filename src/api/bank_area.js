import request from '../utils/request';

export function getBankArea() {
    return request({
        url: '/bankArea/bankArea',
        method: 'get'
    });
}
