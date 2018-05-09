import request from '../utils/request';

export function workIndex(data) {
    return request({
        url: '/workIndex',
        method: 'post',
        headers: {'Content-Type':'application/json'},
        data
    });
}

export function deleteWorkIndex(data) {
    return request({
        url: '/workIndex',
        method: 'delete',
        params:data
    });
}

export function workIndexes(data) {
    return request({
        url: '/workIndex',
        method: 'get',
        params:data
    });
}

export function workIndexesWithPage(data) {
    return request({
        url: '/workIndexes',
        method: 'get',
        params: data
    });
}

export function updateWorkIndexByDepositor(data) {
    return request({
        url: '/workIndex/Depositor',
        method: 'put',
        data
    });
}

export function updateWorkIndexByApprovalState(data) {
    return request({
        url: '/workIndex/ApprovalState',
        method: 'put',
        data
    });
}
