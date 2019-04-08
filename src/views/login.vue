<style lang="less">
    @import 'login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-title">
            <img style="height: 90px" src="../images/title_logo.png"/>
        </div>
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userCode">
                            <Input v-model="form.userCode" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <!--<FormItem>-->
                            <!--<RadioGroup v-model="form.system">-->
                                <!--<Radio label="old">办理非企业类核准账户业务</Radio>-->
                                <!--<Radio label="new">上传企业类账户影像</Radio>-->
                            <!--</RadioGroup>-->
                        <!--</FormItem>-->
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <a class="login-tip" :href="downloadUrl" download="chrome">推荐使用Chrome点击下载</a>
                    <!--<Button class="login-tip" type="text" href="http://0.0.0.0:8888/api/download/chrome">推荐使用chrome</Button>-->
                    <!--<p class="login-tip">欢迎使用人民币结算账户影像传输系统</p>-->
                </div>
            </Card>
        </div>
        <Modal v-model="transactionType" width="360" :mask-closable="false" :closable="false">
            <p slot="header" style="color: #1c2438;text-align: center">
                <Icon type="ios-information-circle"></Icon>
                <span>业务类型</span>
            </p>
            <div style="text-align: center">
                请选择办理的业务类型?
            </div>
            <div slot="footer">
                <Button type="info" size="large" long @click="handleNonBusiness">办理非企业类核准账户业务</Button>
                <br><br>
                <Button type="success" size="large" long @click="handleBusiness">上传企业类账户影像</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';
    import {getChrome} from '../api/download';

    export default {
        data () {
            return {
                form: {
                    userCode: '',
                    password: '',
                    system:''
                },
                rules: {
                    userCode: [
                        { required: true, message: '账号不能为空', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '密码不能为空', trigger: 'blur' }
                    ]
                },
                downloadUrl:'',
                transactionType:false
            };
        },
        methods: {
            handleSubmit () {
                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.$store.dispatch('Login', this.form).then(() => {
                            var user = JSON.parse(Cookies.get('user'));
                            if (user.userstate === '0'){ //0表示用户启用
                                if (user.userlevel == '7' || user.userlevel == '3' || user.userlevel == '6'){
                                    this.$router.push({path:'/admin'});
                                }
                                else {
                                    this.transactionType = true;
                                }
                                // else if (this.form.system == 'old') {
                                //     this.$router.push({path:'/'});
                                // } else if (this.form.system == 'new') {
                                //     this.$router.push({path:'/SV'});
                                // }
                            } else {
                                this.$Message.info({
                                    content: '用户被锁定！请联系管理员解锁！',
                                    duration: 5
                                });
                            }

                        }).catch(error => {
                            this.$Message.error(error.message);
                        });
                    }
                });
            },
            downloadChrome:function () {
                var ua = navigator.userAgent;
                // alert(ua);
                if(ua.indexOf('Windows NT 5') > -1 || ua.indexOf('Windows XP') > -1) {
                    this.downloadUrl = 'http://' + location.host + '/zhyxcs/api/download/chrome?type=xp';
                } else {
                    this.downloadUrl = 'http://' + location.host + '/zhyxcs/api/download/chrome';
                }
            },
            handleNonBusiness:function () {
                this.$router.push({path:'/'});
            },
            handleBusiness:function () {
                this.$router.push({path:'/SV'});
            }
        },
        mounted: function () {
            this.downloadChrome();
        }
    };
</script>

<style>
</style>
