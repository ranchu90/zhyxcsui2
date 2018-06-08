import request from '../utils/request';

export function getChrome() {
    return request({
        url: '/download/chrome',
        method: 'get'
    });
}
