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
        params: params
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
        params: params
    });
}

export function getPBCList() {
    return request({
        url: '/orga/getPBCList',
        method: 'get'
    });
}

export function diaryPrint(startTime) {
    const params = {
        startTime: startTime,
    };
    return request({
        url: '/statistics/diaryprint',
        method: 'get',
        params: params
    });
}