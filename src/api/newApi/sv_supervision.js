import request from "../../utils/request";

export function supervisionsWithPage(data) {
    return request({
        url: '/supervision/supervisions',
        method: 'get',
        params: data
    });
}

export function supervision(data) {
    return request({
        url: '/supervision/supervision',
        method: 'post',
        headers: {'Content-Type':'application/json'},
        data
    });
}

export function deleteSupervision(data) {
    return request({
        url: '/supervision/supervision',
        method: 'delete',
        params:data
    });
}

export function updateSupervisionByApprovalState(data, params) {
    return request({
        url: '/supervision/ApprovalState',
        method: 'put',
        params: params,
        headers: {'Content-Type':'application/json'},
        data
    });
}

export function getSupervisionNum(data) {
    return request({
        url: '/supervision/supervisionNum',
        method: 'get',
        params: data
    });
}

export function queryOperators(transactionNum) {
    const data = {
        transactionNum: transactionNum
    }
    return request({
        url: '/supervision/operators',
        method: 'get',
        params: data
    });
}

export function occupyTransaction(transactionNum) {
    const param = {
        transactionNum: transactionNum
    }
    return request({
        url: '/supervision/occupy',
        method: 'get',
        params: param
    });
}