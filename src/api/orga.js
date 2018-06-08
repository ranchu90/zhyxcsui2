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
        bankCode:bankCode
    }
    return request({
        url: '/orga/bankCode',
        method: 'get',
        params:param
    });
}
