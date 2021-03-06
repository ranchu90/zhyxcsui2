import request from '../utils/request';

export function measureRequest(pbcCode, areaCode, cityCode, bankKind, bankType, bankCode, startTime, endTime) {
    const params = {
        pbcCode: pbcCode,
        areaCode: areaCode,
        cityCode: cityCode,
        bankKind: bankKind,
        bankType: bankType,
        bankCode: bankCode,
        startTime: startTime,
        endTime: endTime,
    };
    return request({
        url: '/statistics/measure',
        method: 'get',
        params: params,
        timeout: 5*60000
    });
}

export function mistakeRequest(pbcCode, areaCode, cityCode, bankKind, bankType, bankCode, startTime, endTime) {
    const params = {
        pbcCode: pbcCode,
        areaCode: areaCode,
        cityCode: cityCode,
        bankKind: bankKind,
        bankType: bankType,
        bankCode: bankCode,
        startTime: startTime,
        endTime: endTime,
    };
    return request({
        url: '/statistics/mistake',
        method: 'get',
        params: params,
        timeout: 5*60000
    });
}

export function getPBCList() {
    return request({
        url: '/orga/getPBCList',
        method: 'get'
    });
}

export function diaryPrint(bankKind, bankType, bankName, startTime, endTime) {
    const params = {
        bankKind: bankKind,
        bankType: bankType,
        bankName: bankName,
        startTime: startTime,
        endTime: endTime
    };
    return request({
        url: '/statistics/diaryprint',
        method: 'get',
        params: params
    });
}