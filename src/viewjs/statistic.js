import Cookies from 'js-cookie';
import {measureRequest} from '../api/statisticAjax';

export default {
    data() {
        return {
            measureTableShow: false,
            mistakeTableShow: false,
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
                    this.statisticTableShow = 'measureTable';
                    const measureData = response.data.measureResult;
                    this.measure_table_list = measureData;
                    this.table_loading = false;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        resetConditions: function () {
            for (var key in this.formStatistic) {
                this.formStatistic[key] = null;
            }
        }
    }
};
