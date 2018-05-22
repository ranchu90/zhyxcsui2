import request from '../utils/request';

export function getBusinessBankType() {
    return request({
        url: '/banktype/business',
        method: 'get'
    });
}

export function getAllBusinessBankType() {
    return request({
        url: '/banktype/businesses',
        method: 'get'
    });
}
