<style lang="less">
    @import "./main.less";
</style>
<template>
    <div class="main">
        <div class="main-header-con">
            <div class="main-header">
                <div class="navicon-con">
                    <div class="layout-logo">
                        <img src="../images/Logo_Ren.png" style="width: 40px;height: 40px;"/>
                    </div>
                    <div class="layout-title">人民币银行结算账户影像传输系统</div>
                </div>

                <div class="header-middle-con">
                    <Menu mode="horizontal" theme="dark" active-name="1" transfer="true" @on-select="changeData">
                        <div class="layout-nav">
                            <Submenu name="check"  v-show="userLevel!=='3' && userLevel!=='6' && userLevel!=='7'">
                                <template slot="title">
                                    <Icon type="ios-navigate"></Icon>
                                    影像审批
                                </template>
                                <MenuItem name="check-edit" v-show="userLevel === '1' ">影像录入</MenuItem>
                                <MenuItem name="check-review" v-show="userLevel === '2' ">影像复核</MenuItem>
                                <MenuItem name="check-recheck" v-show="userLevel === '4' ">影像审核</MenuItem>
                                <MenuItem name="check-passed" v-show="userLevel === '5' ">影像复审</MenuItem>
                            </Submenu>
                            <Submenu name="query" v-show="userLevel!=='3' && userLevel!=='6'">
                                <template slot="title">
                                    <Icon type="ios-analytics"></Icon>
                                    查询统计
                                </template>
                                <MenuItem name="query">业务查询</MenuItem>
                                <MenuItem name="statistic">业务统计</MenuItem>
                            </Submenu>
                            <Submenu name="manage" v-show="userLevel === '7' || userLevel === '6' || userLevel === '3'">
                                <template slot="title">
                                    <Icon type="ios-keypad"></Icon>
                                    系统管理
                                </template>
                                <MenuItem name="user-manage" v-show="userLevel === '3' || userLevel === '6' || userLevel === '7'">用户管理</MenuItem>
                                <!--<MenuItem name="manage-3">影像分类</MenuItem>-->
                                <MenuItem v-show="userLevel === '7'" name="log-manage">日志管理</MenuItem>
                            </Submenu>
                        </div>
                    </Menu>
                </div>

                <div class="header-avator-con">
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="password" >修改密码</DropdownItem>
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar icon="person" style="background: #619fe7;margin-left:10px;"></Avatar>
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
                    2018 &copy; 中国人民銀行湖南省
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
                case 'check-edit':this.$router.push({path:'bank_entry'});break;
                case 'check-review':this.$router.push({path:'bank_review'});break;
                case 'check-recheck':this.$router.push({path:'ren_entry'});break;
                case 'check-passed':this.$router.push({path:'ren_recheck'});break;
                case 'user-manage':
                    if (this.userLevel === '3'){
                        this.$router.push({path:'bank_charge'});
                    } else if (this.userLevel === '6' || this.userLevel === '7') {
                        this.$router.push({path:'ren_charge'});
                    };
                    break;
                case 'log-manage': this.$router.push({path:'system_log'});break;
                case 'query':this.$router.push({path:'query'}); break;
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
        }
    },
    mounted:function () {

        this.init();
    }
};
</script>
