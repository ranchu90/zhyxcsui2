import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import {addUser, getUser, resetUserPassword, updateUser} from '../api/user';
import {getBusinessBankType} from '../api/banktype';
import {getOrga} from '../api/orga';
import Cookies from 'js-cookie';
import {forceLogout} from '../api/login';

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
                suserstate:'0', //默认启用
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
            tabSelected: 1,
            passed_Num: 0,
            newTaskModal: false,
            saveTaskModal: false,
            bankType:'',
            bankTypeList:[],
            ruleCustom:{
                susercode:[
                    { validator: validateUserCode, trigger: 'blur' }
                ],
                suserlevel:[
                    { validator: validateUserLevel, trigger: 'blur' }
                ],
                susername:[
                    { validator: validateUserName, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        changeTab: function (name) {
            this.table_cols = [];
            [...this.table_cols] = this.table_default_cols;

            this.accelerated = false;

            switch (name){
                case 'passed':
                    this.tabSelected = 4;
                    this.table_cols.push(this.table_passed);
                    this.breadCrumb = '待传证';
                    break;
                case 'recheck':
                    this.tabSelected = 5;
                    this.table_cols.push(this.table_pass);
                    this.breadCrumb = '待复审';
                    break;
                case 'final':
                    this.tabSelected = 6;
                    this.table_cols.push(this.table_pass);
                    this.breadCrumb = '已结束';
            }

            this.changePage();
        },
        changePage:function (page) {
            this.table_loading = true;

            if (page != null){
                this.currentPage = page;
            }

            var userCode = this.current_user.usercode;

            getUser(userCode, this.pageSize, this.currentPage).then(response => {
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

            getUser(userCode, this.pageSize, this.currentPage).then(response => {
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
            this.newTaskModal = true;
        },
        initTable:function () {
            var userCode = this.current_user.usercode;

            getUser(userCode).then(response => {
                if (response.status === 200){
                    this.table_list = response.data.pageInfo.list;
                    this.totalPages = response.data.pageInfo.total;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });

            this.getBankType();
        },
        addUserConfirm:function () {
            this.$refs.newTaskForm.validate((valid) => {
                if (valid) {
                    //添加本級用戶
                    this.user.sbankcode = this.current_user.bankcode;

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
            this.newTaskModal = false;
            this.user = this.user_default;
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
            getBusinessBankType().then(response => {
                if (response.status === 200){
                    this.bankTypeList = response.data;
                }
            }).catch(error => {
                this.$Message.error(error.message);
            });
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
        }
    },
    mounted:function () {

        this.current_user = JSON.parse(Cookies.get('user'));
        this.user = this.user_default;

        this.initTable();
    }
};
