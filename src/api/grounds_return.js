import request from '../utils/request';

export function getAllGrounds() {
    return request({
        url: '/grounds/grounds',
        method: 'get'
    });
}
