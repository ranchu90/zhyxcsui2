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
                        <FormItem>
                            <RadioGroup v-model="form.system">
                                <Radio label="old">非企业类</Radio>
                                <Radio label="new">企业类</Radio>
                            </RadioGroup>
                        </FormItem>
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
                downloadUrl:''
            };
        },
        methods: {
            handleSubmit () {

                if(this.form.system == ''){
                    this.$Message.warning("请选择业务种类！");
                } else {
                    this.$refs.loginForm.validate((valid) => {
                        if (valid) {
                            this.$store.dispatch('Login', this.form).then(() => {
                                var user = JSON.parse(Cookies.get('user'));
                                if (user.userstate === '0'){ //0表示用户启用
                                    if (this.form.system == 'old') {
                                        this.$router.push({path:'/'});
                                    } else if (this.form.system == 'new') {
                                        this.$router.push({path:'/SV'});
                                    }  else {
                                        this.$Message.warning("企业类账户正在开发中！");
                                    }
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
                }
            },
            downloadChrome:function () {
                var ua = navigator.userAgent;
                // alert(ua);
                if(ua.indexOf('Windows NT 5') > -1 || ua.indexOf('Windows XP') > -1) {
                    this.downloadUrl = 'http://' + location.host + '/zhyxcs/api/download/chrome?type=xp';
                } else {
                    this.downloadUrl = 'http://' + location.host + '/zhyxcs/api/download/chrome';
                }
            }
        },
        mounted: function () {
            this.downloadChrome();
        }
    };
</script>

<style>
</style>
