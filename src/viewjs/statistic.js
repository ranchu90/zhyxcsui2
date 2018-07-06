import Cookies from 'js-cookie';
import {measureRequest, mistakeRequest, getPBCList, diaryPrint} from '../api/statisticAjax';
import {getBankArea} from '../api/bank_area';
import {getBankCity} from '../api/bank_city';
import {getBankKind} from '../api/bank_kind';
import {getBankTypeByBankKind} from '../api/banktype';
import printjs from 'print-js';

export default {
    data() {
        return {
            measureTableShow: false,
            mistakeTableShow: false,
            current_user: {},
            pbcList: [],
            bankAreaList: [],
            bankCityList: [],
            bankKindList: [],
            bankTypeList: [],
            formStatistic: {
                pbcCode: null,
                areaCode: null,
                cityCode: null,
                bankKind: null,
                bankType: null,
                bankCode: null,
                bankName: null,
                startTime: null,
                endTime: null
            },
            formStatisticDefault: {
                pbcCode: null,
                areaCode: null,
                cityCode: null,
                bankKind: null,
                bankType: null,
                bankCode: null,
                bankName: null,
                startTime: null,
                endTime: null
            },
            measure_table_cols: [
                {
                    title: '业务类别',
                    key: 'businessCategory'
                },
                {
                    title: '账户种类',
                    key: 'accountType'
                },
                {
                    title: '总数',
                    key: 'total'
                },
                {
                    title: '过审数',
                    key: 'approval'
                },
                {
                    title: '退回数',
                    key: 'untread'
                }],
            measure_table_list: [],
            measure_table_loading: false,
            mistake_table_cols: [
                {
                    title: '业务类别',
                    key: 'businessCategory'
                },
                {
                    title: '差错类型',
                    key: 'grounds'
                },
                {
                    title: '笔数',
                    key: 'untread'
                }],
            mistake_table_list: [],
            mistake_table_loading: false,
        };
    },
    methods: {
        measureWithConditions: function () {
            measureRequest(
                this.formStatistic.pbcCode,
                this.formStatistic.areaCode,
                this.formStatistic.cityCode,
                this.formStatistic.bankKind,
                this.formStatistic.bankType,
                this.formStatistic.bankCode,
                this.formStatistic.startTime,
                this.formStatistic.endTime
            ).then(response => {
                if (response.status === 200) {
                    this.measureTableShow = true;
                    this.mistakeTableShow = false;
                    const measureData = response.data.measureResult;
                    this.measure_table_list = measureData;
                    this.measure_table_loading = false;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });


        },
        mistakeWithConditions: function () {
            mistakeRequest(
                this.formStatistic.pbcCode,
                this.formStatistic.areaCode,
                this.formStatistic.cityCode,
                this.formStatistic.bankKind,
                this.formStatistic.bankType,
                this.formStatistic.bankCode,
                this.formStatistic.startTime,
                this.formStatistic.endTime
            ).then(response => {
                if (response.status === 200) {
                    this.measureTableShow = false;
                    this.mistakeTableShow = true;
                    const mistakeData = response.data.mistakeResult;
                    this.mistake_table_list = mistakeData;
                    this.mistake_table_loading = false;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        resetConditions: function () {
            for (var key in this.formStatistic) {
                this.formStatistic[key] = null;
            }
        },
        initData: function () {
            getPBCList().then(response => {
                if (response.status === 200) {
                    this.pbcList = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
            getBankArea().then(response => {
                if (response.status === 200) {
                    this.bankAreaList = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
            getBankKind().then(response => {
                if (response.status === 200) {
                    this.bankKindList = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        getBankCity: function (bankAreaValue) {
            if (bankAreaValue) {
                getBankCity(bankAreaValue).then(response => {
                    if (response.status === 200) {
                        this.bankCityList = response.data;
                    }
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            } else {
                this.bankCityList = null;
            }
        },
        getBankTypes: function (bankKindValue) {
            if (bankKindValue) {
                getBankTypeByBankKind(bankKindValue).then(response => {
                    if (response.status === 200) {
                        this.bankTypeList = response.data;
                    }
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            } else {
                this.bankTypeList = null;
            }
        },
        measurePrint: function () {
            var printJsonData = [];
            this.measure_table_list.forEach(function (item) {
                var newItem = {
                    "业务类别": item.businessCategory,
                    "账户种类": item.accountType,
                    "总数": item.total,
                    "过审数": item.approval,
                    "退回数": item.untread,
                };
                printJsonData.push(newItem);
            });
            printjs({
                printable: printJsonData,
                properties: [
                    '业务类别',
                    '账户种类',
                    '总数',
                    '过审数',
                    '退回数'
                ],
                type: 'json',
                gridHeaderStyle: 'color: black;  border: 1px solid #3971A5;font-size:14px',
                gridStyle: 'border: 1px solid #3971A5;font-size:11px;text-align: center;',
                documentTitle: '影像系统业务量统计表',
                header: '影像系统业务量统计表',
                headerStyle: 'text-align: center;font-size:16px',
                repeatTableHeader: true
            });
        },
        mistakePrint: function () {
            var printJsonData = [];
            this.mistake_table_list.forEach(function (item) {
                var newItem = {
                    "业务类别": item.businessCategory,
                    "差错类型": item.grounds,
                    "笔数": item.untread
                };
                printJsonData.push(newItem);
            });
            printjs({
                printable: printJsonData,
                properties: [
                    '业务类别',
                    '差错类型',
                    '笔数'
                ],
                type: 'json',
                gridHeaderStyle: 'color: black;  border: 1px solid #3971A5;font-size:14px',
                gridStyle: 'border: 1px solid #3971A5;font-size:11px;text-align: center;',
                documentTitle: '影像系统差错统计表',
                header: '影像系统差错统计表',
                headerStyle: 'text-align: center;font-size:16px',
                repeatTableHeader: true
            });
        },
        printAccountDiary: function () {
            if (this.formStatistic.startTime === undefined || this.formStatistic.startTime === null || this.formStatistic.startTime === '') {
                this.$Message.info('请选择查询条件的开始时间作为账户资料清单的统计时间');
                return;
            }
            diaryPrint(
                this.formStatistic.bankKind,
                this.formStatistic.bankType,
                this.formStatistic.bankName,
                this.formStatistic.startTime,
                this.formStatistic.endTime
            ).then(response => {
                if (response.status === 200) {
                    if (response.data.hasOwnProperty('warn')) {
                        this.$Message.warning(response.data.warn);
                    }
                    if (response.data.hasOwnProperty('list')) {
                        const diaryBeanList = response.data.list;
                        var printJsonData = [];
                        diaryBeanList.forEach(function (item) {
                            var newItem = {
                                "序号": item.index,
                                "存款人名称": item.depositorName,
                                "银行机构代码": item.bankCode,
                                "银行机构名称": item.bankName,
                                "业务类型": item.businessCategory,
                                "许可证核准号": item.approvalCode,
                                "签收人": '',
                                '签收时间': ''
                            };
                            printJsonData.push(newItem);
                        });
                        var diaryTimeStr = '';

                        if (this.formStatistic.startTime != undefined && this.formStatistic.startTime != null && this.formStatistic.startTime != '') {
                            var tempStartDate = new Date(this.formStatistic.startTime);
                            diaryTimeStr = tempStartDate.getFullYear() + '年' + (tempStartDate.getMonth() + 1) + '月' + tempStartDate.getDate() + '日';
                        }

                        if (!this.current_user.bankcode.startsWith('0')) {

                            if (this.formStatistic.endTime != undefined && this.formStatistic.endTime != null && this.formStatistic.endTime != '') {
                                var otherTempStartDate = new Date(this.formStatistic.startTime);
                                var tempEndDate = new Date(this.formStatistic.endTime);
                                if (otherTempStartDate.getTime() != tempEndDate.getTime()) {
                                    diaryTimeStr += '至' + tempEndDate.getFullYear() + '年' + (tempEndDate.getMonth() + 1) + '月' + tempEndDate.getDate() + '日';
                                }
                            }

                        }

                        printjs({
                            printable: printJsonData,
                            properties: [
                                '序号',
                                '存款人名称',
                                '银行机构代码',
                                '银行机构名称',
                                '业务类型',
                                '许可证核准号',
                                '签收人',
                                '签收时间'
                            ],
                            type: 'json',
                            gridHeaderStyle: 'color: black;  border: 1px solid #3971A5;font-size:14px',
                            gridStyle: 'border: 1px solid #3971A5;font-size:11px;text-align: center;',
                            documentTitle: '账户资料清单',
                            header: diaryTimeStr + '账户资料清单',
                            headerStyle: 'text-align: center;font-size:16px',
                            repeatTableHeader: true,
                        });
                    }
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        }
    },
    mounted: function () {
        this.current_user = JSON.parse(Cookies.get('user'));
        this.initData();
    }
};
