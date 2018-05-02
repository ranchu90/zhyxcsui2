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
                    <div class="layout-title">人民币结算账户影像传输系统</div>
                </div>

                <div class="header-middle-con">
                    <Menu mode="horizontal" theme="dark" active-name="1" transfer="true">
                        <div class="layout-nav">
                            <Submenu name="check">
                                <template slot="title">
                                    <Icon type="ios-navigate"></Icon>
                                    影像审批
                                </template>
                                <MenuItem name="check-1">影像录入</MenuItem>
                                <MenuItem name="check-2">影像复核</MenuItem>
                                <MenuItem name="check-3">影像审批</MenuItem>
                                <MenuItem name="check-4">影像复审</MenuItem>
                            </Submenu>
                            <Submenu name="query">
                                <template slot="title">
                                    <Icon type="ios-keypad"></Icon>
                                    查询统计
                                </template>
                                <MenuItem name="query-1">业务查询</MenuItem>
                                <MenuItem name="query-2">业务统计</MenuItem>
                            </Submenu>
                            <Submenu name="manage">
                                <template slot="title">
                                    <Icon type="ios-analytics"></Icon>
                                    系统管理
                                </template>
                                <MenuItem name="manage-1">机构管理</MenuItem>
                                <MenuItem name="manage-2">用户管理</MenuItem>
                                <MenuItem name="manage-3">影像分类</MenuItem>
                                <MenuItem name="manage-4">日志管理</MenuItem>
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
                <router-view></router-view>
                <div class="main-copy">
                    2018 &copy; 中国人民銀行湖南省
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie';

export default {
    data(){
        return {
            userName: ''
        };
    },
    methods: {
        init () {
            this.userName = Cookies.get('user');
        },
        handleClickUserDropdown () {
            this.$router.push({
                name: 'login'
            });
        }
    },
    mounted:function () {

        this.init();
    }
};
</script>
