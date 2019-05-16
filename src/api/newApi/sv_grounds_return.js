import request from '../../utils/request';

export function getAllGrounds() {
    return request({
        url: '/svgrounds/grounds',
        method: 'get'
    });
}
