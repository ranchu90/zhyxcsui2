import request from '../utils/request';

export function getSystemLog(pageNum, pageSize) {
    const param = {
        pageSize: pageSize,
        pageNum: pageNum
    }

    return request({
        url: '/systemlog/systemlog',
        method: 'get',
        params: param
    });
}
