import request from '../utils/request';

export function getBankKind() {
    return request({
        url: '/bankKind/bankKind',
        method: 'get'
    });
}
