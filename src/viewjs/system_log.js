import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import {addUser, getUser, updateUser, getUserByBankType, resetUserPassword} from '../api/user';
import {getBusinessBankType, getAllBusinessBankType} from '../api/banktype';
import {getOrga} from '../api/orga';
import Cookies from 'js-cookie';
import {getSystemLog} from '../api/system_log';

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
                    title: '用户代码',
                    key: 'susercode'
                },
                {
                    title: '真实姓名',
                    key: 'susename'
                },
                {
                    title:'用户所在行',
                    key: 'sbankname'
                },
                {
                    title: '所在行代码',
                    key: 'sbankcode'
                },
                {
                    title: '内容',
                    key: 'scomments'
                },
                {
                    title: 'ip地址',
                    key: 'sipaddress'
                },
                {
                    title:'操作时间',
                    key: 'slogtime'
                },
                {
                    title:'Mac地址',
                    key: 'smacaddress'
                }
            ],
            table_list: [
                {
                    susercode:'123',
                    susername:'ues',
                    suserstate:'启用',
                    suserlevel:'6',
                    suserontime:'2018-06-18',
                    stelephone:'1332019203',
                    semail:'dlsi182@qq.com'
                },
                {
                    susercode:'123',
                    susername:'ues',
                    suserstate:'启用',
                    suserlevel:'6',
                    suserontime:'2018-06-18',
                    stelephone:'1332019203',
                    semail:'dlsi182@qq.com'
                },
                {
                    susercode:'123',
                    susername:'ues',
                    suserstate:'启用',
                    suserlevel:'6',
                    suserontime:'2018-06-18',
                    stelephone:'1332019203',
                    semail:'dlsi182@qq.com'
                },
                {
                    susercode:'123',
                    susername:'ues',
                    suserstate:'启用',
                    suserlevel:'6',
                    suserontime:'2018-06-18',
                    stelephone:'1332019203',
                    semail:'dlsi182@qq.com'
                }],
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
            allBankTypeList:[]
        };
    },
    methods: {
        changePage:function (pageNum) {
            this.table_loading = true;

            if (pageNum != null){
                this.currentPage = pageNum;
            }

            getSystemLog(this.currentPage, this.pageSize).then(response => {
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
        changePageSize:function (pageSize) {
            this.table_loading = true;

            if (pageSize != null){
                this.pageSize = pageSize;
            }

            getSystemLog(this.currentPage, this.pageSize).then(response => {
                if (response.status === 200){
                    this.table_list = response.data.list;
                    this.totalPages = response.data.total;
                    this.table_loading = false;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        newTask:function () {
            this.getBankType();
            this.newTaskModal = true;
        },
        initTable:function () {
            this.changePage(1);
        },
        addUserConfirm:function () {

            //添加本級用戶
            if (this.user.suserlevel === '4' || this.user.suserlevel === '5'){
                this.user.sbankcode = this.current_user.bankcode;
            }

            if (this.current_user.userlevel === '7'){
                this.user.suserlevel = '6';
            }

            addUser(this.user).then(response => {
                if (response.status === 200){
                    this.$Message.success('添加用户成功');
                    this.newTaskModal = false;
                    this.user = this.user_default;
                    this.initTable();
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        cancelAddUser:function () {
            this.user = this.user_default;
            this.newTaskModal = false;
        },
        getAllUsers:function () {
            var userCode = this.current_user.usercode;

            getUser(userCode).then(response => {
                if (response.status === 200){
                    this.table_list = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        getOrgaCode:function (value) {
            this.user.sbankcode = '';

            if (value === '6'){
                this.bankType = '001'; //人行营业代码
            } else if (value === '3'){
                return;
            }

            getOrga(this.current_user.bankcode, this.bankType).then(response => {
                if (response.status === 200){
                    this.orgaList = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        getBankType:function () {
            if (this.current_user.userlevel === '6') {
                getBusinessBankType().then(response => {
                    if (response.status === 200) {
                        this.bankTypeList = response.data;
                    }
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            } else if (this.current_user.userlevel === '7'){
                this.bankType = '001';
                getOrga(this.current_user.bankcode, this.bankType).then(response => {
                    if (response.status === 200){
                        this.orgaList = response.data;
                    }
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            }
        },
        saveUserConfirm:function () {

            updateUser(this.user).then(response => {
                if (response.status === 200){
                    this.$Message.success('修改用户成功');
                    this.saveTaskModal = false;
                    this.user = this.user_default;
                    this.initTable();
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        cancelSaveUser:function () {
            this.user = this.user_default;
            this.saveTaskModal = false;
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
        queryByBankType:function (value) {
            if (value === ''){
                this.getAllUsers();
            } else {
                var userCode = this.current_user.usercode;

                getUserByBankType(userCode, value).then(response => {
                    if (response.status === 200){
                        this.table_list = response.data;
                    }
                }).catch(error => {
                    this.$Message.error(error.message);
                });
            }
        }
    },
    mounted:function () {
        this.current_user = JSON.parse(Cookies.get('user'));
        this.user = this.user_default;

        this.initTable();
    }
};
