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
