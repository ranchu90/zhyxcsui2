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
                <BreadcrumbItem to="/ren_charge">
                    <Icon type="social-buffer-outline"></Icon> 系统管理
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Icon type="pound"></Icon> 数据导入
                </BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div class="layout-content">
            <div class="layout-content-main">
                <template>
                    <div class="myDiv">
                        <div style="text-align: center">
                            <p style="font-size:15px">数据格式如下：</p>
                            <p style="font-size:15px">存款人名称|注册地地区代码|法定代表人或负责人姓名|上级单位名称|上级法人基本存款账户开户许可证核准号|法定代表人/负责人姓名|存款人证明文件1编号|开户银行机构代码|账户性质|账户账号|账户名称|开户日期|销户日期|账户状态</p>
                            <Upload
                                    :before-upload="handleUpload"
                                    type="drag"
                                    action="//jsonplaceholder.typicode.com/posts/">
                                <div style="padding: 20px 0">
                                    <Icon type="ios-cloud-upload" size="100" style="color: #3399ff"></Icon>
                                    <p style="font-size: large">点击此处或拖拽文件到此</p>
                                </div>
                            </Upload>
                            <div style="font-size: large" v-if="file !== null">所选文件: {{ file.name }}     <Button type="primary" style="font-size: large" @click="upload" :loading="loadingStatus">{{ loadingStatus ? '上传中' : '点击上传' }}</Button></div>
                        </div>
                        <p style="font-size:15px">数据导入记录：</p>
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
    </div>
</template>
<script src="../../../viewjs/adminPages/import_account_info.js"></script>
