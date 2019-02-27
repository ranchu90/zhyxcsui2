import request from '../../utils/request';

export function uploadImage(data) {
    return request({
        url: '/svimage/image',
        method: 'post',
        headers: {'Content-Type':'multipart/form-data'},
        data
    });
}

export function deleteImage(data) {
    return request({
        url: '/svimage/image',
        method: 'delete',
        params:data
    });
}

export function getImages(data) {
    return request({
        url: '/svimage/images',
        method: 'get',
        params:data
    });
}

export function getBase64Image(data) {
    return request({
        url: '/svimage/image64',
        method: 'get',
        timeout: 60000,
        responseType:'blob',
        params:data
    });
}
