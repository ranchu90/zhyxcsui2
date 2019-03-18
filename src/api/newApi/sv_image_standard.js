import request from "../../utils/request";

export function businessCategory() {
    return request({
        url: '/svimages/businessCategory',
        method: 'get',
        headers: {'Content-Type':'application/json'}
    });
}

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

export function svAccountType(businessCategory) {
    const params = {
        businessCategory:businessCategory
    };
    return request({
        url: '/images/accountType',
        method: 'get',
        headers: {'Content-Type':'application/json'},
        params:params
    });
}