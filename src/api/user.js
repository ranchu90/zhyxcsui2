import request from '../utils/request';

export function getUser(addUserCode, pageSize, pageNum, bankCode, bankName, userName, userCode, bankTypeCode) {
    const param = {
        addUserCode : addUserCode,
        pageSize: pageSize,
        pageNum: pageNum,
        bankTypeCode: bankTypeCode,
        bankCode: bankCode,
        bankName: bankName,
        userName: userName,
        userCode: userCode
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
