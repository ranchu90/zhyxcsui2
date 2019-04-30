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


export function updateAccountSys(data) {

    return request({
        url: '/accountsys/account',
        method: 'post',
        headers: {'Content-Type':'multipart/form-data'},
        data
    });
}