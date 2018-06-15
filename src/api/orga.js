import request from '../utils/request';

export function getOrga(pbcCode, bankTypeCode) {
    const data = {
        pbcCode: pbcCode,
        bankTypeCode: bankTypeCode
    };

    return request({
        url: '/orga/orga',
        method: 'get',
        params: data
    });
}

export function orgaWithKindAndPbcCode(pbcCode, bankKind) {
    const data = {
        pbcCode: pbcCode,
        bankKind: bankKind
    };

    return request({
        url: '/orga/orgaWithKindAndPbcCode',
        method: 'get',
        params: data
    });
}

export function getBankCityByBankCode(bankCode) {
    const param = {
        bankCode: bankCode
    };
    return request({
        url: '/orga/bankCode',
        method: 'get',
        params: param
    });
}

export function getCurrentPage(pageNum,
                               pageSize,
                               bankAreaCode,
                               bankCityCode,
                               bankKind,
                               bankTypeCode,
                               topBankCode,
                               pbcode,
                               bankCode,
                               bankName,
                               bankState) {
    const param = {
        pageSize: pageSize,
        pageNum: pageNum,
        bankAreaCode: bankAreaCode,
        bankCityCode: bankCityCode,
        bankKind: bankKind,
        bankTypeCode: bankTypeCode,
        topBankCode: topBankCode,
        pbcode: pbcode,
        bankCode: bankCode,
        bankName: bankName,
        bankState: bankState
    };

    return request({
        url: '/orga/pageorga',
        method: 'get',
        params: param
    });
}

export function removeOrgaList(bankCodes) {
    const param = {
        bankCodes: bankCodes
    };
    return request({
        url: '/orga/removeOrgaList',
        method: 'get',
        params: param
    });
}

export function addOrga(data) {
    return request({
        url: '/orga/addorga',
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        data
    });
}

export function getNextOrgaIsOnCountByBankCode(bankCode) {
    const param = {
        bankCode: bankCode
    };
    return request({
        url: '/orga/getNextOrgaIsOnCountByBankCode',
        method: 'get',
        params: param
    });
}

export function updateOrga(data) {
    return request({
        url: '/orga/updateorga',
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        data
    });
}
