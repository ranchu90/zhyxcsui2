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

export function workIndexes(pageNum, pageSize,currentBankArea, currentCity, bankKind, bankType,
                            businessCategory, accountType, orgaCode, bankEntryUserCode,
                            bankReviewUserCode, renEntryUserCode, renRecheckUserCode,
                            transactionNum, approvalCode, identifier, startTime, endTime) {
    const params = {
        pageSize:pageSize,
        pageNum:pageNum,
        currentBankArea:currentBankArea,
        currentCity:currentCity,
        bankKind:bankKind,
        bankType:bankType,
        businessCategory:businessCategory,
        accountType:accountType,
        orgaCode:orgaCode,
        bankEntryUserCode:bankEntryUserCode,
        bankReviewUserCode:bankReviewUserCode,
        renEntryUserCode:renEntryUserCode,
        renRecheckUserCode:renRecheckUserCode,
        transactionNum:transactionNum,
        approvalCode:approvalCode,
        identifier:identifier,
        startTime:startTime,
        endTime:endTime
    };
    return request({
        url: '/workIndex/workIndex',
        method: 'get',
        params:params
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

export function updateWorkIndexByApprovalCodeAndIdentifier(data, expireTime) {
    const params = {
        expireTime: expireTime
    }
    return request({
        url: '/workIndex/ApprovalCode',
        method: 'put',
        params:params,
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

export function queryOperators(transactionNum) {
    const data = {
        transactionNum: transactionNum
    }
    return request({
        url: '/workIndex/operators',
        method: 'get',
        params: data
    });
}
