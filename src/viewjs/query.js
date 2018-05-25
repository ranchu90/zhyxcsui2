import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import {addUser, getUser, updateUser, getUserByBankType, resetUserPassword} from '../api/user';
import {getAllBusinessBankType, getBusinessBankType,} from '../api/banktype';
import {getOrga} from '../api/orga';
import {workIndexes} from '../api/workindex';
import {businessCategory, accountType} from '../api/image_standard';
import {getBankArea} from '../api/bank_area';
import {getBankCity} from '../api/bank_city';
import {getBankKind} from '../api/bank_kind';
import Cookies from 'js-cookie';

Cropper.setDefaults({
    viewMode: 1,
    dragMode: 'move',
    autoCrop: false,
    toggleDragModeOnDblclick: false
});

export default {
    data () {
        return {
            table_cols: [],
            table_default_cols: [
                {
                    type:'index',
                    align:'center',
                    width:60
                },
                {
                    title: '流水号',
                    key: 'stransactionnum'
                },
                {
                    title: '存款人名称',
                    key: 'sdepositorname'
                },
                {
                    title: '审批状态',
                    key: 'sapprovalstate'
                },
                {
                    title: '业务类别',
                    key: 'sbusinesscategory'
                },
                {
                    title: '账户种类',
                    key: 'saccounttype'
                },
                {
                    title:'开户银行机构代码',
                    key: 'sbankcode'
                },
                {
                    title:'开户银行机构名称',
                    key: 'sbankname'
                },
                {
                    title:'录入结束时间',
                    key: 'sendtime'
                },
                {
                    title:'审核完成时间',
                    key: 'srechecktime'
                }
            ],
            table_list: [],
            user:{},
            user_default:{
                susercode:'',
                sbankcode:'',
                susername:'',
                suserstate:'0',
                suserlevel:'',
                stelephone:'',
                semail:''
            },
            current_user:{},
            orgaList:[],//机构列表
            table_loading: false,
            /*分页*/
            pageSize: 10,
            currentPage: 1,
            totalPages: 100,
            //选中的tab标签，编辑，复核，审核，通过
            passed_Num: 0,
            newTaskModal: false,
            saveTaskModal: false,
            bankType:'',
            allBankType:'',
            bankTypeList:[],
            allBankTypeList:[],
            formSearch:{
                currentBankArea: null,
                currentCity: null,
                bankKind: null,
                bankType:null,
                orgaCode:null,
                businessCategory: null,
                accountType: null,
                bankEntryUserCode: null,
                bankReviewUserCode: null,
                renEntryUserCode: null,
                renRecheckUserCode: null,
                transactionNum: null,
                approvalCode: null,
                identifier: null,
                startTime: null,
                endTime: null
            },
            formSearchDefault:{
                currentBankArea: null,
                currentCity: null,
                bankKind: null,
                bankType:null,
                orgaCode:null,
                businessCategory: null,
                accountType: null,
                bankEntryUserCode: null,
                bankReviewUserCode: null,
                renEntryUserCode: null,
                renRecheckUserCode: null,
                transactionNum: null,
                approvalCode: null,
                identifier: null,
                startTime: null,
                endTime: null
            },
            businessCategoryList:[],
            accountTypeList:[],
            bankAreaList:[],
            bankCityList:[],
            bankKindList:[]
        };
    },
    methods: {
        changePage:function (pageNum) {
            this.table_loading = true;

            if (pageNum != null){
                this.currentPage = pageNum;
            }

            this.getWorkIndexes();
        },
        changePageSize:function (pageSize) {
            this.table_loading = true;

            if (pageSize != null){
                this.pageSize = pageSize;
            }

            // getSystemLog(this.currentPage, this.pageSize).then(response => {
            //     if (response.status === 200){
            //         this.table_list = response.data.list;
            //         this.totalPages = response.data.total;
            //         this.table_loading = false;
            //     }
            // }).catch(error => {
            //     this.$Message.error(error.message);
            // });
            workIndexes(this.currentPage, this.pageSize,
                this.formSearch.currentBankArea, this.formSearch.currentCity,
                this.formSearch.bankKind, this.formSearch.bankType,
                this.formSearch.businessCategory, this.formSearch.accountType,
                this.formSearch.orgaCode, this.formSearch.bankEntryUserCode,
                this.formSearch.bankReviewUserCode, this.formSearch.renEntryUserCode,
                this.formSearch.renRecheckUserCode, this.formSearch.transactionNum,
                this.formSearch.approvalCode, this.formSearch.identifier,
                this.formSearch.startTime, this.formSearch.endTime
            ).then(response => {
                if (response.status === 200){
                    const pageInfo = response.data.pageInfo;
                    this.table_list = pageInfo.list;
                    this.totalPages = pageInfo.total;
                    this.table_loading = false;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        initTable:function () {
            this.changePage(1);
            getAllBusinessBankType().then(response => {
                if (response.status === 200) {
                    this.allBankTypeList = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });

            businessCategory().then(response => {
                if (response.status === 200) {
                    this.businessCategoryList = response.data;
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
        levelType:function (level) {

            var text = '';
            switch (level) {
                case '1':
                    text = '银行录入员';
                    break;
                case '2':
                    text = '银行复核员';
                    break;
                case '3':
                    text = '银行主管';
                    break;
                case '4':
                    text = '人行录入员';
                    break;
                case '5':
                    text = '人行复审员';
                    break;
                case '6':
                    text = '人行主管';
                    break;
                case '7':
                    text = '人行超级管理员';
                    break;
            }

            return text;
        },
        getWorkIndexes:function(){
            workIndexes(this.currentPage, this.pageSize,
                this.formSearch.currentBankArea, this.formSearch.currentCity,
                this.formSearch.bankKind, this.formSearch.bankType,
                this.formSearch.businessCategory, this.formSearch.accountType,
                this.formSearch.orgaCode, this.formSearch.bankEntryUserCode,
                this.formSearch.bankReviewUserCode, this.formSearch.renEntryUserCode,
                this.formSearch.renRecheckUserCode, this.formSearch.transactionNum,
                this.formSearch.approvalCode, this.formSearch.identifier,
                this.formSearch.startTime, this.formSearch.endTime
                ).then(response => {
                    if (response.status === 200){
                        const pageInfo = response.data.pageInfo;
                        this.table_list = pageInfo.list;
                        this.totalPages = pageInfo.total;
                        this.table_loading = false;
                    }
                }).catch(error => {
                    this.$Message.error(error.message);
                });
        },
        getAccountType:function (value) {
            this.accountTypeList = [];
            this.formSearch.accountType = null;

            if (this.formSearch.businessCategory != null){
                accountType(this.formSearch.businessCategory).then(response => {
                    if (response.status === 200){
                        this.accountTypeList = response.data;
                    }
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            }
        },
        getBankCity:function () {
            this.bankCityList = [];
            this.formSearch.currentCity = null;

            if (this.formSearch.currentBankArea != null){
                getBankCity(this.formSearch.currentBankArea).then(response => {
                    if (response.status === 200){
                        this.bankCityList = response.data;
                    }
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            }
        },
        searchByConditions:function () {
            this.currentPage = 1;
            this.getWorkIndexes();
        },
        resetConditions:function () {
            for (var key in this.formSearch) {
                this.formSearch[key] = null;
            }
        }
    },
    mounted:function () {
        this.current_user = JSON.parse(Cookies.get('user'));
        this.user = this.user_default;

        this.initTable();
    }
};
