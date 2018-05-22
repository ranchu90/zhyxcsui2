<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        height: 100%;
    }
    .layout-assistant{
        width: 400px;
        margin: 0 auto;
        height: inherit;
        font-size: small;
    }
    .layout-content{
        height: 100%;
        width: 100%;
        margin: 0px;
        overflcow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 5px;
    }
    .img-container{
        margin-bottom: 1rem;
        height: 0;/*594*420*/
        /*min-height: 600px;*/
        /*max-height: 700px;*/
        width: 100%;
        padding-bottom: 142.43%;
        /*min-width: 210px;*/
        /*margin-top: 5px;*/
        border: 1px solid #dddee1;
    }
    .main-file{
        float: left;
        position: relative;
        width: 100%;
    }
    .attachment-files{
        /*padding-left: 10px;*/
        float: left;
        position: relative;
        width: 100%;
    }
    .attachment-imgs{
        width: 100%;
        margin-left: 5px;
        text-align: center;
        float: left;
        position: relative;
    }
    .informations{
        width: 100%;
        margin-left: 10px;
        margin-left: 10px;
        float: left;
        position: relative;
        text-align: center;
    }
    .img-list{
        display: inline-block;
        text-align: center;
        overflow: auto;
        /*position: absolute;*/
        bottom: 0px;
    }
    .img-list li{
        display: block;
        padding-top: 5px;
    }
    /*上传 */
    input {
        position: absolute;
        left: -9999px;
    }
    /* 使label充满整个box*/
    label {
        position: absolute;
        top: 0;left: 0;right: 0;bottom: 0;
        z-index: 10; /* 这个z-index之后说到*/
    }
    .myCropper-workspace {
        width: 100%;
        height: 0px;
        margin-top: 5px;
    }
    .myCropper-workspace .myCropper-words{
        text-align: center;
        font-size: 18px;
        padding-top: 180px;
    }
    .tool-bar{
        text-align: center;
    }
    .tool-bar Button{
        margin-right: 3px;
        margin-bottom: 5px;
        text-align: center;
        width: inherit;
    }
    .cropper-container{
        height: 100%;
        width: 100%;
    }
    .cropper-preiveiw-container{
        text-align: left;
        display: inline-block;
    }
    .cropper-preiveiw-container .img-container{
        margin-bottom: 1rem;
        max-height: 708px;
        min-height: 297px;
        max-width: 520px;
        min-width: 210px;
        margin-top: 5px;
        display: block;
    }
    .layout-breadcrumb{
        padding: 0px 15px 0;
    }
</style>
<template>
    <div class="layout">
        <!--<Menu mode="horizontal" style="width: 100%; " theme="light" active-name="passed" @on-select="changeTab">-->
        <!--<div class="layout-assistant">-->
        <!--<MenuItem name="passed">-->
        <!--<Badge :count="passed_Num" >-->
        <!--<Icon type="ios-list"></Icon>-->
        <!--待传证<span v-show="passed_Num!==0">&nbsp;&nbsp;&nbsp;</span>-->
        <!--</Badge>-->
        <!--</MenuItem>-->
        <!--<MenuItem name="recheck">-->
        <!--<Icon type="android-checkbox-outline-blank"></Icon>-->
        <!--待复审-->
        <!--</MenuItem>-->
        <!--<MenuItem name="final">-->
        <!--<Icon type="ios-flower"></Icon>-->
        <!--已结束-->
        <!--</MenuItem>-->
        <!--</div>-->
        <!--</Menu>-->
        <div class="layout-breadcrumb">
        <Breadcrumb>
        <BreadcrumbItem to="/">
        <Icon type="ios-home-outline"></Icon> 主页
        </BreadcrumbItem>
        <BreadcrumbItem to="/bank_charge">
        <Icon type="social-buffer-outline"></Icon> 影像复审
        </BreadcrumbItem>
        <BreadcrumbItem>
        <Icon type="pound"></Icon> 用户管理
        </BreadcrumbItem>
        </Breadcrumb>
        </div>
        <div class="layout-content">
            <div class="layout-content-main">
                <template>
                    <div>
                        <Button type="primary" shape="circle" style="margin-bottom: 5px" @click="newTask">
                            <Icon type="plus-circled"></Icon>
                            新建用户
                        </Button>
                        <Table stripe :columns="table_default_cols" :data="table_list" :loading="table_loading"></Table>
                        <div style="margin:10px;overflow:hidden;">
                            <div style="float: right;">
                                <Page :total="totalPages" :current="currentPage"
                                      :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize"
                                      show-total show-sizer transfer></Page>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <Modal
                v-model="newTaskModal"
                title="新建用户"
                :styles="{display: 'flex', alignItems:'left', justifyContent:'center'}">
            <div class="cropper-preiveiw-container">
                <Form ref="newTaskForm" :model="user" :label-width="100">
                    <FormItem label="用户代码" prop="sbusinesscategory">
                        <Input v-model="user.susercode" type="text" :row="2" placeholder="请输入用户代码..."></Input>
                    </FormItem>
                    <FormItem label="用户级别" prop="saccounttype">
                        <Select v-model="user.suserlevel" placeholder="按行别搜索" style="margin-left:100px; width:300px" @on-change="getOrgaCode">
                            <Option value="1">银行行录入员</Option>
                            <Option value="2">银行复核员</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="用户机构" >
                        <p>
                            {{current_user.bankcode}}
                        </p>
                    </FormItem>
                    <FormItem label="真实姓名">
                        <Input v-model="user.susername" type="text" :row="10" placeholder="请输入真实姓名..."></Input>
                    </FormItem>
                    <!--<FormItem label="用户状态">-->
                    <!--&lt;!&ndash;<Input v-model="user.suserstate" type="textarea" :row="10" placeholder="请输入用户状态..."></Input>&ndash;&gt;-->
                    <!--<div>-->
                    <!--<RadioGroup v-model="user.suserstate" type="button">-->
                    <!--<Radio label="0" >启用</Radio>-->
                    <!--<Radio label="1">停用</Radio>-->
                    <!--</RadioGroup>-->
                    <!--</div>-->
                    <!--</FormItem>-->
                    <FormItem label="电话">
                        <Input v-model="user.stelephone" type="text" :row="10" placeholder="请输入电话..."></Input>
                    </FormItem>
                    <FormItem label="邮箱">
                        <Input v-model="user.semail" type="text" :row="10" placeholder="请输入邮箱..."></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="default" @click="cancelAddUser">
                    取消
                </Button>
                <Button type="primary" @click="addUserConfirm">
                    确定
                </Button>
            </div>
        </Modal>
        <Modal
                v-model="saveTaskModal"
                title="编辑用户"
                :styles="{display: 'flex', alignItems:'center', justifyContent:'center'}">
            <div class="cropper-preiveiw-container">
                <Form ref="saveTaskForm" :model="user" :label-width="100">
                    <FormItem label="用户代码">
                        <p>
                            {{user.susercode}}
                        </p>
                    </FormItem>
                    <FormItem label="用户级别">
                        <p>
                            {{levelType(user.suserlevel)}}
                        </p>
                    </FormItem>
                    <FormItem label="用户机构" style="width:350px">
                        <p>
                            {{ user.sbankname}}
                        </p>
                    </FormItem>
                    <FormItem label="真实姓名">
                        <Input v-model="user.susername" type="text" :row="10" placeholder="请输入真实姓名..."></Input>
                    </FormItem>
                    <FormItem label="用户状态">
                        <!--<Input v-model="user.suserstate" type="textarea" :row="10" placeholder="请输入用户状态..."></Input>-->
                        <div>
                            <RadioGroup v-model="user.suserstate" type="button">
                                <Radio label="0" >启用</Radio>
                                <Radio label="1">停用</Radio>
                            </RadioGroup>
                        </div>
                    </FormItem>
                    <FormItem label="电话">
                        <Input v-model="user.stelephone" type="text" :row="10" placeholder="请输入电话..."></Input>
                    </FormItem>
                    <FormItem label="邮箱">
                        <Input v-model="user.semail" type="text" :row="10" placeholder="请输入邮箱..."></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="default" @click="cancelSaveUser">
                    取消
                </Button>
                <Button type="primary" @click="saveUserConfirm">
                    确定
                </Button>
            </div>
        </Modal>
    </div>
</template>
<script src="../../viewjs/bank_charge.js"></script>
