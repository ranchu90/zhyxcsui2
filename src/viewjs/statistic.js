import Cookies from 'js-cookie';
import {measureRequest, mistakeRequest, getPBCList} from '../api/statisticAjax';
import {getBankArea} from "../api/bank_area";
import {getBankCity} from '../api/bank_city';
import {getBankKind} from '../api/bank_kind';
import {getBankTypeByBankKind} from '../api/banktype';

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
        }
    },
    mounted: function () {
        this.current_user = JSON.parse(Cookies.get('user'));
        this.initData();
    }
};