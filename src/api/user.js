import request from '../utils/request';

export function getUser(userCode, pageSize, pageNum) {
    const param = {
        addUserCode : userCode,
        pageSize: pageSize,
        pageNum: pageNum
    }

    return request({
        url: '/user/user',
        method: 'get',
        params: param
    });
}

export function bankReviewCheck() {
    return request({
        url: '/user/bankReviewCheck',
        method: 'get'
    });
}

export function getUserByBankType(userCode, bankType) {
    const param = {
        addUserCode: userCode,
        bankTypeCode: bankType
    }

    return request({
        url: '/user/userWithBankType',
        method: 'get',
        params: param
    });
}

export function addUser(data) {
    return request({
        url: '/user/user',
        method: 'post',
        headers: {'Content-Type':'application/json'},
        data
    });
}

export function updateUser(data) {
    return request({
        url: '/user/userInfo',
        method: 'post',
        headers: {'Content-Type':'application/json'},
        data
    });
}

export function changeUserPassword(oldPwd, newPwd) {
    const params = {
        oldPwd: oldPwd,
        newPwd: newPwd
    }
    return request({
        url: '/user/pwd',
        method: 'post',
        params:params
    });
}

export function resetUserPassword(userCode) {
    const params = {
        userCode: userCode
    }
    return request({
        url: '/user/originPwd',
        method: 'post',
        params:params
    });
}
