import request from '../utils/request';

export function workIndex(data) {
    return request({
        url: '/workIndex/workIndex',
        method: 'post',
        headers: {'Content-Type':'application/json'},
        data
    });
}

export function deleteWorkIndex(data) {
    return request({
        url: '/workIndex/workIndex',
        method: 'delete',
        params:data
    });
}

export function workIndexes(data) {
    return request({
        url: '/workIndex/workIndex',
        method: 'get',
        params:data
    });
}

export function workIndexesWithPage(data) {
    return request({
        url: '/workIndex/workIndexes',
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

export function updateWorkIndexByApprovalState(data, params) {
    return request({
        url: '/workIndex/ApprovalState',
        method: 'put',
        params: params,
        headers: {'Content-Type':'application/json'},
        data
    });
}

export function updateWorkIndexByApprovalCodeAndIdentifier(data) {
    return request({
        url: '/workIndex/ApprovalCode',
        method: 'put',
        data
    });
}

export function getReceipt(data) {
    return request({
        url: '/workIndex/receipt',
        method: 'get',
        responseType: 'blob',
        params: data
    });
}

export function getworkIndexNum(data) {
    return request({
        url: '/workIndex/workIndexNum',
        method: 'get',
        params: data
    });
}

export function updateBusinessEmergency(data) {
    return request({
        url: '/workIndex/businessEmergency',
        method: 'post',
        headers: {'Content-Type':'application/json'},
        data
    });
}
