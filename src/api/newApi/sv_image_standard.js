import request from "../../utils/request";

export function svBasicCategory() {
    return request({
        url: '/svimages/basicCategory',
        method: 'get',
        headers: {'Content-Type':'application/json'}
    });
}

export function svCertificateType(businessCategory, accountType) {
    var params = {
        businessCategory: businessCategory,
        accountType: accountType
    }

    return request({
        url: '/svimages/certificateType',
        method: 'get',
        params:params
    });
}