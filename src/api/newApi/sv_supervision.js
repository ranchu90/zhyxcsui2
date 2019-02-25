import request from "../../utils/request";

export function supervisions(pageNum, pageSize,currentBankArea, currentCity, bankKind, bankType,
                            businessCategory, accountType, orgaCode, bankEntryUserCode,
                            bankReviewUserCode, renEntryUserCode, renRecheckUserCode,
                            transactionNum, approvalCode, identifier, startTime, endTime) {
    const params = {
        pageSize:pageSize,
        pageNum:pageNum,
        currentBankArea:currentBankArea,
        currentCity:currentCity,
        bankKind:bankKind,
        bankType:bankType,
        businessCategory:businessCategory,
        accountType:accountType,
        orgaCode:orgaCode,
        bankEntryUserCode:bankEntryUserCode,
        bankReviewUserCode:bankReviewUserCode,
        renEntryUserCode:renEntryUserCode,
        renRecheckUserCode:renRecheckUserCode,
        transactionNum:transactionNum,
        approvalCode:approvalCode,
        identifier:identifier,
        startTime:startTime,
        endTime:endTime
    };
    return request({
        url: '/supervision/supervision',
        method: 'get',
        params:params
    });
}

export function supervisionsWithPage(data) {
    return request({
        url: '/supervision/supervisions',
        method: 'get',
        params: data
    });
}