import request from '../utils/request';

export function getBankCity(bankAreaCode) {
    const param = {
        bankAreaCode:bankAreaCode
    }
    return request({
        url: '/bankCity/bankCity',
        method: 'get',
        params:param
    });
}
