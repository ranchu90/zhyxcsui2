import request from '../utils/request';

export function insertReview(data) {
    return request({
        url: '/approvalRecord/record',
        method: 'post',
        data
    });
}

export function getReview(data) {
    return request({
        url: '/approvalRecord/record',
        method: 'get',
        params:data
    });
}
