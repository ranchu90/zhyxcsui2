<style lang="less">
    @import "./main.less";
</style>
<style>
    .ivu-menu-submenu{
        float: right !important;
    }
</style>
<template>
    <div class="main">
        <div class="main-header-con">
            <div class="main-header">
                <div class="navicon-con">
                    <div class="layout-logo">
                        <img src="../images/Logo_Ren.png" style="width: 40px;height: 40px;"/>
                    </div>
                    <div class="layout-title">人民币银行结算账户企业类事后监督系统 2.0</div>
                </div>

                <div class="header-middle-con">
                    <Menu mode="horizontal" theme="dark" active-name="1" transfer="true" @on-select="changeData">
                        <div class="layout-nav">
                            <Submenu name="manage" v-show="userLevel === '7' || userLevel === '6' || userLevel === '3'">
                                <template slot="title">
                                    <Icon type="ios-keypad"></Icon>
                                    系统管理
                                </template>
                                <MenuItem v-show="userLevel === '7'" name="orga-manage">机构管理</MenuItem>
                                <MenuItem name="user-manage" v-show="userLevel === '3' || userLevel === '6' || userLevel === '7'">用户管理</MenuItem>
                                <MenuItem v-show="userLevel === '7'" name="log-manage">日志管理</MenuItem>
                            </Submenu>
                            <Submenu name="query" v-show="userLevel!=='3' && userLevel!=='6'">
                                <template slot="title">
                                    <Icon type="ios-analytics"></Icon>
                                    查询统计
                                </template>
                                <MenuItem name="query">业务查询</MenuItem>
                                <MenuItem name="statistic">业务统计</MenuItem>
                            </Submenu>
                            <Submenu name="check"  v-show="userLevel!=='3' && userLevel!=='6' && userLevel!=='7'">
                                <template slot="title">
                                    <Icon type="ios-navigate"></Icon>
                                    影像操作
                                </template>
                                <MenuItem name="check-edit" v-show="userLevel === '1' ">影像录入</MenuItem>
                                <MenuItem name="check-review" v-show="userLevel === '2' ">影像复核</MenuItem>
                                <MenuItem name="check-recheck" v-show="userLevel === '4' ">影像审核</MenuItem>
                                <MenuItem name="check-passed" v-show="userLevel === '5' ">影像复审</MenuItem>
                            </Submenu>
                        </div>
                    </Menu>
                </div>

                <div class="header-avator-con">
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <Tooltip placement="bottom">
                                        <div slot="content">
                                            {{userBankName}}
                                        </div>
                                        <span class="main-user-name">{{userRole}} : {{userName}} </span>
                                    </Tooltip>
                                        <span style="font-size:15px;margin-left:10px;color: #ffffff">签退</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="password" >修改密码</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <!--<Avatar icon="person" style="background: #619fe7;margin-left:10px;"></Avatar>-->
                        </Row>
                    </div>
                </div>
            </div>
        </div>
        <div class="single-page-con">
            <div class="single-page">
                <!--<div class="layout-breadcrumb">-->
                    <!--<Breadcrumb>-->
                    <!--<BreadcrumbItem href="#">test1</BreadcrumbItem>-->
                    <!--<BreadcrumbItem href="#">test2</BreadcrumbItem>-->
                    <!--<BreadcrumbItem>test3</BreadcrumbItem>-->
                    <!--</Breadcrumb>-->
                <!--</div>-->
                <router-view></router-view>
                <div class="main-copy">
                    2018-2019 &copy; Powered by the central branch of The People's Bank of China, Xiangxi
                </div>
            </div>
        </div>
        <Modal
                v-model="changePwdModal"
                title="修改密码"
                :closable="false"
                :styles="{display: 'flex', alignItems:'center', justifyContent:'center'}">
            <Form ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="80">
                <FormItem label="原密码" prop="oldPasswd">
                    <Input type="password" v-model="formCustom.oldPasswd" number></Input>
                </FormItem>
                <FormItem label="新密码" prop="passwd">
                    <Input type="password" v-model="formCustom.passwd"></Input>
                </FormItem>
                <FormItem label="新密码确认" prop="passwdCheck">
                    <Input type="password" v-model="formCustom.passwdCheck"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" @click="handleReset('formCustom')">
                    取消
                </Button>
                <Button type="primary" @click="handleSubmit('formCustom')">
                    确定修改
                </Button>
            </div>
        </Modal>
    </div>
</template>
<script>
import Cookies from 'js-cookie';
import {changeUserPassword} from '../api/user';

export default {
    data(){
        const validateOldPass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入旧密码'));
            } else {
                callback();
            }
        };
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入您的新密码'));
            } else {
                if (this.formCustom.passwdCheck !== '') {
                    // 对第二个密码框单独验证
                    this.$refs.formCustom.validateField('passwdCheck');
                }
                callback();
            }
        };
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.formCustom.passwd) {
                callback(new Error('两次密码输入不匹配!'));
            } else {
                callback();
            }
        };

        return {
            userName: '',
            userLevel:'',
            userBankName: '',
            userRole: '',
            formCustom: {
                passwd: '',
                passwdCheck: '',
                oldPasswd: ''
            },
            changePwdModal:false,
            ruleCustom: {
                oldPasswd:[
                    { validator: validateOldPass, trigger: 'blur' }
                ],
                passwd: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                passwdCheck: [
                    { validator: validatePassCheck, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        init () {
            var user = JSON.parse(Cookies.get('user'));
            this.userName = user.username;
            this.userLevel = user.userlevel;
            this.userBankName = user.userBankName;

            switch (this.userLevel){
                case '1': this.userRole = '银行录入'; break;
                case '2': this.userRole = '银行主管'; break;
                case '3': this.userRole = '银行管理'; break;
                case '4': this.userRole = '人行审核'; break;
                case '5': this.userRole = '人行主管'; break;
                case '6': this.userRole = '人行管理'; break;
                case '7': this.userRole = '超级管理'; break;
            }
        },
        handleClickUserDropdown (name) {
            switch (name){
                case 'password':
                    this.changePwdModal = true;
                    break;
                case 'loginout':
                    this.$store.dispatch('Logout').then(() => {
                        this.$router.push({path:'/login'});
                    }).catch(error => {
                        this.$Message.error(error.message);
                    });
                    break;
            }
        },
        changeData: function (name) {
            switch (name){
                case 'check-edit':this.$router.push({path:'sv_bank_entry'});break;
                case 'check-review':this.$router.push({path:'sv_bank_review'});break;
                case 'check-recheck':this.$router.push({path:'sv_ren_entry'});break;
                case 'check-passed':this.$router.push({path:'sv_ren_recheck'});break;
                case 'user-manage':
                    if (this.userLevel === '3'){
                        this.$router.push({path:'sv_bank_charge'});
                    } else if (this.userLevel === '6' || this.userLevel === '7') {
                        this.$router.push({path:'sv_ren_charge'});
                    };
                    break;
                case 'log-manage': this.$router.push({path:'sv_system_log'});break;
                case 'query':this.$router.push({path:'sv_query'}); break;
                case 'statistic':this.$router.push({path:'sv_statistic'}); break;
                case 'orga-manage':this.$router.push({path:'sv_orga'}); break;
            }
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {

                    changeUserPassword(this.formCustom.oldPasswd, this.formCustom.passwd).then(response => {
                        if (response.status === 200){
                            const data = response.data;

                            if (data.status === 'success') {
                                this.$Message.success(data.message);
                                this.changePwdModal = false;
                            } else {
                                this.$Message.error(data.message);
                            }
                        }
                    }).catch(error => {
                        this.$Message.error(error.message);
                    });
                } else {
                    this.$Message.error('信息不完整！');
                }
            });
        },
        handleReset (name) {
            this.$refs[name].resetFields();
            this.changePwdModal = false;
        },
        closeBrowser: function () {
            this.$store.dispatch('Logout').then(() => {
                this.$router.push({path:'/login'});
            }).catch(error => {
                this.$Message.error(error.message);
            });
        }
    },
    mounted:function () {

        this.init();

        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isOpera = userAgent.indexOf('Opera') > -1; //判断是否Opera浏览器
        var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera; //判断是否IE浏览器
        var isIE11 = userAgent.indexOf('rv:11.0') > -1; //判断是否是IE11浏览器
        var isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器

        if(!isIE && !isEdge && !isIE11) {//兼容chrome和firefox
            var _beforeUnload_time = 0, _gap_time = 0;
            var is_fireFox = navigator.userAgent.indexOf('Firefox')>-1;//是否是火狐浏览器
            var is_chrome = navigator.userAgent.indexOf('Chrome')>-1;//是否是火狐浏览器

            const self = this;

            window.onunload = function (){
                _gap_time = new Date().getTime() - _beforeUnload_time;
                if(_gap_time <= 5){
                    self.closeBrowser();//浏览器关闭
                }else{//浏览器刷新
                }
            }
            window.onbeforeunload = function (){
                _beforeUnload_time = new Date().getTime();
                if(is_fireFox){//火狐关闭执行
                    self.closeBrowser();//浏览器关闭
                }
            };
        }
    }
};
</script>
