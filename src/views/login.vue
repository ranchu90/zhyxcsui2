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
                    password: ''
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

                this.$refs.loginForm.validate((valid) => {
                    if (valid) {
                        this.$store.dispatch('Login', this.form).then(() => {
                            var user = JSON.parse(Cookies.get('user'));
                            if (user.userstate === '0'){ //0表示用户启用
                                this.$router.push({path:'/'});
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
                this.downloadUrl = 'http://' + location.host + '/zhyxcs/api/download/chrome';
            }
        },
        mounted: function () {
            this.downloadChrome();
        }
    };
</script>

<style>
</style>
