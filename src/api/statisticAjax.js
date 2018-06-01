import request from '../utils/request';

export function measureRequest(pbcCode,areaCode,cityCode,bankKind,bankType,bankCode,startTime,endTime) {
    const params = {
        pbcCode:pbcCode,
        areaCode:areaCode,
        cityCode:cityCode,
        bankKind:bankKind,
        bankType:bankType,
        bankCode:bankCode,
        startTime:startTime,
        endTime:endTime,
    };
    return request({
        url: '/statistics/measure',
        method: 'get',
        params:params
    });
}