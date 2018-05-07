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

export function uploadImage(data) {
    return request({
        url: '/image/image',
        method: 'post',
        headers: {'Content-Type':'multipart/form-data'},
        data
    });
}

export function deleteImage(data) {
    return request({
        url: '/image/image',
        method: 'delete',
        params:data
    });
}

export function getImages(data) {
    return request({
        url: '/image/images',
        method: 'get',
        params:data
    });
}

export function getBase64Image(data) {
    return request({
        url: '/image/image64',
        method: 'get',
        params:data
    });
}
