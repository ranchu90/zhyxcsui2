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

export function getBankTypeByBankKind(bankKind) {
    const param = {
        bankKindCode:bankKind
    }
    return request({
        url: '/banktype/getTypesByBankKind',
        method: 'get',
        params:param
    });
}
