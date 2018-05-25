import request from '../utils/request';

export function getSystemLog(pageNum, pageSize, userCode, userName,
                             bankCode, bankName, ipAddress, comments,
                             startTime, endTime) {
    const param = {
        pageSize: pageSize,
        pageNum: pageNum,
        userCode: userCode,
        userName: userName,
        bankCode: bankCode,
        bankName: bankName,
        ipAddress: ipAddress,
        comments: comments,
        startTime: startTime,
        endTime: endTime
    }

    return request({
        url: '/systemlog/systemlog',
        method: 'get',
        params: param
    });
}
