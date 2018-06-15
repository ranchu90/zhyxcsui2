import request from '../utils/request';

export function uploadLicenceImage(data) {
    return request({
        url: '/licence/licence',
        method: 'post',
        headers: {'Content-Type':'multipart/form-data'},
        data
    });
}

export function deleteLicenceImage(data) {
    return request({
        url: '/licence/licence',
        method: 'delete',
        params:data
    });
}

export function getLicenceImage(data) {
    return request({
        url: '/licence/licence',
        method: 'get',
        responseType: 'blob',
        params:data
    });
}
