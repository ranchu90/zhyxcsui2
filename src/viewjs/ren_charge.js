import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import {addUser, getUser, updateUser, resetUserPassword} from '../api/user';
import {getBusinessBankType, getAllBusinessBankType} from '../api/banktype';
import {getOrga, orgaWithKindAndPbcCode} from '../api/orga';
import {forceLogout} from '../api/login';
import Cookies from 'js-cookie';

Cropper.setDefaults({
    viewMode: 1,
    dragMode: 'move',
    autoCrop: false,
    toggleDragModeOnDblclick: false
});

export default {
    data () {
        const validateUserCode = (rule, value, callback) => {
            if (value.length !== 6) {
                callback(new Error('用户代码必须为6位'));
            } else {
                callback();
            }
        };

        const validateUserName = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('用户名不能为空'));
            } else if (value.length > 20){
                callback(new Error('用户名长度不能超过20'));
            } else {
                callback();
            }
        };

        const validateBankCode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('银行代码不能为空'));
            } else {
                callback();
            }
        };

        const validateUserLevel = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('用户级别不能为空'));
            } else {
                callback();
            }
        };

        const validateTelephone = (rule, value, callback) => {
            if (value.length > 15) {
                callback(new Error('电话号码不能超过15个字符'));
            } else {
                callback();
            }
        };

        const validateEmail = (rule, value, callback) => {
            if (value.length > 50) {
                callback(new Error('Email不能超过50个字符'));
            } else {
                callback();
            }
        };

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
                    key: 'susername'
                },
                {
                    title:'用户所在行',
                    key: 'sbankname'
                },
                {
                    title: '用户状态',
                    key: 'suserstate',
                    render:(h, params) => {
                        const state = params.row.suserstate;
                        const color = (state === '1') ? 'red' : 'green';
                        const text = (state === '1') ? '停用' : '启用';

                        return h('Tag', {
                            props:{
                                type: 'dot',
                                color: color
                            }
                        }, text);
                    }
                },
                {
                    title: '用户级别',
                    key: 'suserlevel',
                    render:(h, params) => {
                        const level = params.row.suserlevel;
                        var text = this.levelType(level);

                        return h('Tag', {
                        }, text);
                    }
                },
                {
                    title: '启用时间',
                    key: 'suserontime',
                    render:(h, params) => {
                        const time = params.row.suserontime;
                        var timeStr = time.substring(0,19);
                        return h('div', timeStr);
                    }
                },
                {
                    title:'用户电话',
                    key: 'stelephone'
                },
                {
                    title:'用户邮箱',
                    key: 'semail'
                },
                {
                    title:'操作',
                    key: 'action',
                    width: 200,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.user = JSON.parse(JSON.stringify(params.row));
                                        this.saveTaskModal = true;
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'info',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        var userCode = params.row.susercode;

                                        this.$Modal.confirm({
                                            title: '重置密码请求',
                                            content: '<p>是否重置用户</p><p>'+ userCode +'的密码</p>',
                                            onOk: () => {
                                                // this.$Message.info('Clicked ok');
                                                resetUserPassword(userCode).then(response => {
                                                    if (response.status === 200){
                                                        const data = response.data;
                                                        if (data.status === 'success'){
                                                            this.$Message.success(data.message);
                                                        } else {
                                                            this.$Message.error(data.message);
                                                        }
                                                    }
                                                }).catch(error => {
                                                    this.$Message.error(error.message);
                                                });
                                            },
                                            onCancel: () => {
                                                // this.$Message.info('Clicked cancel');
                                            }
                                        });
                                    }
                                }
                            }, '重置密码'),
                            h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        var userCode = params.row.susercode;

                                        this.$Modal.confirm({
                                            title: '登陆重置请求',
                                            content: '<p>是否重置用户</p><p>'+ userCode +'的登陆状态</p>',
                                            onOk: () => {
                                                // this.$Message.info('Clicked ok');
                                                forceLogout(userCode).then(response => {
                                                    if (response.status === 200){
                                                        const data = response.data;
                                                        if (data.state === 'true'){
                                                            this.$Message.success(data.message);
                                                        } else {
                                                            this.$Message.error(data.message);
                                                        }
                                                    }
                                                }).catch(error => {
                                                    this.$Message.error(error.message);
                                                });
                                            },
                                            onCancel: () => {
                                                // this.$Message.info('Clicked cancel');
                                            }
                                        });
                                    }
                                }
                            }, '签退')
                        ]);
                    }
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
            bankTypeCode: null,
            totalPages: 100,
            //选中的tab标签，编辑，复核，审核，通过
            tabSelected: 1,
            passed_Num: 0,
            newTaskModal: false,
            saveTaskModal: false,
            bankType:'',
            allBankType:'',
            bankTypeList:[],
            allBankTypeList:[],
            //是否时县域人行
            ifXian:true,
            ruleCustom:{
                susercode:[
                    { validator: validateUserCode, trigger: 'blur' }
                ],
                suserlevel:[
                    { validator: validateUserLevel, trigger: 'blur' }
                ],
                sbankcode:[
                    { validator: validateBankCode, trigger: 'blur' }
                ],
                susername:[
                    { validator: validateUserName, trigger: 'blur' }
                ],
                stelephone:[
                    { validator: validateTelephone, trigger: 'blur' }
                ],
                semail:[
                    { validator: validateEmail, trigger: 'blur' }
                ]
            },
            formSearch:{
                fBankCode: null,
                fBankName: null,
                fUserName: null,
                fUserCode: null
            }
        };
    },
    methods: {
        // changeTab: function (name) {
        //     this.table_cols = [];
        //     [...this.table_cols] = this.table_default_cols;
        //
        //     this.accelerated = false;
        //
        //     switch (name){
        //         case 'passed':
        //             this.tabSelected = 4;
        //             this.table_cols.push(this.table_passed);
        //             this.breadCrumb = '待传证';
        //             break;
        //         case 'recheck':
        //             this.tabSelected = 5;
        //             this.table_cols.push(this.table_pass);
        //             this.breadCrumb = '待复审';
        //             break;
        //         case 'final':
        //             this.tabSelected = 6;
        //             this.table_cols.push(this.table_pass);
        //             this.breadCrumb = '已结束';
        //     }
        //
        //     this.changePage();
        // },
        changePage:function (page) {
            this.table_loading = true;

            if (page != null){
                this.currentPage = page;
            }

            var userCode = this.current_user.usercode;

            getUser(userCode, this.pageSize,
                this.currentPage, this.formSearch.fBankCode,
                this.formSearch.fBankName, this.formSearch.fUserName,
                this.formSearch.fUserCode, this.bankTypeCode).then(response => {
                    if (response.status === 200){
                        this.table_list = response.data.pageInfo.list;
                        this.totalPages = response.data.pageInfo.total;
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

            var userCode = this.current_user.usercode;

            getUser(userCode, this.pageSize,
                this.currentPage, this.formSearch.fBankCode,
                this.formSearch.fBankName, this.formSearch.fUserName,
                this.formSearch.fUserCode, this.bankTypeCode).then(response => {
                    if (response.status === 200){
                        this.table_list = response.data.pageInfo.list;
                        this.totalPages = response.data.pageInfo.total;
                        this.table_loading = false;
                    }
            }).catch(error => {
                this.$Message.error(error.message);
            });

        },
        newTask:function () {
            this.getBankType();
            this.newTaskModal = true;
            if (this.current_user.userlevel === '7'){
                this.user.suserlevel = '6';
            }
        },
        initTable:function () {
            this.getAllUsers();

            getAllBusinessBankType().then(response => {
                if (response.status === 200) {
                    this.allBankTypeList = response.data;
                    this.allBankTypeList.unshift({
                        stypename:'所有行',
                        sbanktypecode:''
                    });
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });

            orgaWithKindAndPbcCode(this.current_user.bankcode, '0').then(response => {
                if (response.status === 200) {
                    this.ifXian = response.data.length > 0? false : true;

                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
        },
        addUserConfirm:function () {

            this.$refs.newTaskForm.validate((valid) => {
                if (valid){
                    //添加本級用戶
                    if (this.user.suserlevel === '4' || this.user.suserlevel === '5'){
                        this.user.sbankcode = this.current_user.bankcode;
                    }

                    if (this.current_user.userlevel === '7'){
                        this.user.suserlevel = '6';
                    }

                    addUser(this.user).then(response => {
                        if (response.status === 200){
                            const data = response.data;

                            if (data === 1) {
                                this.$Message.success('添加用户成功');
                                this.newTaskModal = false;
                                this.user = this.user_default;
                                this.initTable();
                            } else {
                                this.$Message.success('用户代码已存在');
                            }
                        }
                    }).catch(error => {
                        this.$Message.error(error.message);
                    });
                }
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
                    this.table_list = response.data.pageInfo.list;
                    this.totalPages = response.data.pageInfo.total;
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
            } else if (value === '4' || value === '5'){
                this.user.sbankcode = this.current_user.sbankcode;
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
            this.$refs.saveTaskForm.validate((valid) => {
                if (valid) {
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
                }
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
            this.bankTypeCode = value;

            // if (value === ''){
            //     this.getAllUsers();
            // } else {
            //     this.bankTypeCode = value;
            //     this.changePage();
            // }
        },
        searchByConditions:function () {
            this.changePage(1);
        },
        resetConditions:function () {
            this.formSearch.fBankCode = null;
            this.formSearch.fBankName = null;
            this.formSearch.fUserName = null;
            this.formSearch.fUserCode = null;
            this.bankTypeCode = '';
            this.allBankType = '';
        }
    },
    mounted:function () {
        this.current_user = JSON.parse(Cookies.get('user'));
        this.user = this.user_default;

        this.initTable();
    }
};
