import request from '../../utils/request';

export function getAccountSysInfo(unitCode, accountNum, accountOpenTime) {
    let data = {
        unitCode: unitCode,
        accountNum: accountNum,
        accountOpenTime: accountOpenTime
    };

    return request({
        url: '/accountsys/account',
        method: 'get',
        params:data
    });
}

export function getAccountSysInfoTwo(status, accountNum, depositorName, unitCode, ifBlurry) {
    let data = {
        status: status,
        accountNum: accountNum,
        depositorName: depositorName,
        unitCode: unitCode,
        ifBlurry: ifBlurry
    };

    return request({
        url: '/accountsys/accountInfo',
        method: 'get',
        params:data
    });
}


export function updateAccountSys(data) {

    return request({
        url: '/accountsys/account',
        method: 'post',
        headers: {'Content-Type':'multipart/form-data'},
        data
    });
}

export function getImportRecord(pageNum, pageSize) {
    const param = {
        pageSize: pageSize,
        pageNum: pageNum
    }

    return request({
        url: '/accountsys/record',
        method: 'get',
        params: param
    });
}