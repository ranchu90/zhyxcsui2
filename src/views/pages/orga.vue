<style scoped>
    .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        height: 100%;
    }

    .layout-assistant {
        width: 400px;
        margin: 0 auto;
        height: inherit;
        font-size: small;
    }

    .layout-content {
        height: 100%;
        width: 100%;
        margin: 0px;
        overflcow: hidden;
        background: #fff;
        border-radius: 4px;
    }

    .layout-content-main {
        padding: 5px;
    }

    .img-container {
        margin-bottom: 1rem;
        height: 0; /*594*420*/
        /*min-height: 600px;*/
        /*max-height: 700px;*/
        width: 100%;
        padding-bottom: 142.43%;
        /*min-width: 210px;*/
        /*margin-top: 5px;*/
        border: 1px solid #dddee1;
    }

    .main-file {
        float: left;
        position: relative;
        width: 100%;
    }

    .attachment-files {
        /*padding-left: 10px;*/
        float: left;
        position: relative;
        width: 100%;
    }

    .attachment-imgs {
        width: 100%;
        margin-left: 5px;
        text-align: center;
        float: left;
        position: relative;
    }

    .informations {
        width: 100%;
        margin-left: 10px;
        margin-left: 10px;
        float: left;
        position: relative;
        text-align: center;
    }

    .img-list {
        display: inline-block;
        text-align: center;
        overflow: auto;
        /*position: absolute;*/
        bottom: 0px;
    }

    .img-list li {
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
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10; /* 这个z-index之后说到*/
    }

    .myCropper-workspace {
        width: 100%;
        height: 0px;
        margin-top: 5px;
    }

    .myCropper-workspace .myCropper-words {
        text-align: center;
        font-size: 18px;
        padding-top: 180px;
    }

    .tool-bar {
        text-align: center;
    }

    .tool-bar Button {
        margin-right: 3px;
        margin-bottom: 5px;
        text-align: center;
        width: inherit;
    }

    .cropper-container {
        height: 100%;
        width: 100%;
    }

    .cropper-preiveiw-container {
        text-align: left;
        display: inline-block;
    }

    .cropper-preiveiw-container .img-container {
        margin-bottom: 1rem;
        max-height: 708px;
        min-height: 400px;
        max-width: 520px;
        min-width: 210px;
        margin-top: 5px;
        display: block;
    }

    .layout-breadcrumb {
        padding: 0px 15px 0;
    }

    .form-input {
        width: 300px;
    }
</style>
<template>
    <div class="layout">
        <div class="layout-breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem to="/">
                    <Icon type="ios-home-outline"></Icon>
                    主页
                </BreadcrumbItem>
                <BreadcrumbItem to="/orga">
                    <Icon type="social-buffer-outline"></Icon>
                    系统管理
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Icon type="pound"></Icon>
                    机构管理
                </BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div class="layout-content">
            <div class="layout-content-main">
                <template>
                    <div>
                        <Form :model="formSearch" label-position="right" :label-width="150" inline>
                            <FormItem label="机构所在地区">
                                <Select v-model="formSearch.bankAreaCode" size="small" style="width: 250px"
                                        @on-change="getBankCity">
                                    <Option v-for="(item, index) in bankAreaList" :value="item.sbankareacode"
                                            :key="index">
                                        {{item.sareaname}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="机构所在城市">
                                <Select v-model="formSearch.bankCityCode" size="small" style="width: 250px">
                                    <Option v-for="(item, index) in bankCityList" :value="item.sbankcitycode"
                                            :key="index">
                                        {{item.scityname}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="机构类别">
                                <Select v-model="formSearch.bankKind" size="small" style="width: 250px"
                                        @on-change="getBankTypes">
                                    <Option v-for="(item, index) in bankKindList" :value="item.sbankkind" :key="index">
                                        {{item.skindname}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="机构行别">
                                <Select v-model="formSearch.bankTypeCode" size="small" style="width: 250px">
                                    <Option v-for="(item, index) in bankTypeList" :value="item.sbanktypecode"
                                            :key="index">
                                        {{item.stypename}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="直属上级行行代码">
                                <Input v-model="formSearch.topBankCode" size="small" style="width: 250px"/>
                            </FormItem>
                            <FormItem label="所属人民银行">
                                <Select v-model="formSearch.pbcode" size="small" style="width: 250px">
                                    <Option v-for="(item, index) in pbcList" :value="item.sbankcode" :key="index">
                                        {{item.sbankname}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="机构代码">
                                <Input v-model="formSearch.bankCode" size="small" style="width: 250px"/>
                            </FormItem>
                            <FormItem label="机构名称">
                                <Input v-model="formSearch.bankName" size="small" style="width: 250px"/>
                            </FormItem>
                            <FormItem label="机构状态">
                                <Select v-model="formSearch.bankState" size="small" style="width: 250px">
                                    <Option value="0">启用</Option>
                                    <Option value="1">停用</Option>
                                </Select>
                            </FormItem>
                            <FormItem label="操作">
                                <Button type="primary" shape="circle" icon="android-add-circle" size="small"
                                        style="margin-bottom: 5px" @click="OpenAddOrgaModal">
                                    新增
                                </Button>
                                <Button type="primary" shape="circle" icon="android-remove-circle" size="small"
                                        style="margin-bottom: 5px" @click="deleteSelections">
                                    刪除
                                </Button>
                                <Button type="primary" shape="circle" icon="android-settings" size="small"
                                        style="margin-bottom: 5px" @click="OpenUpdateOrgaModal">
                                    修改
                                </Button>
                                <Button type="primary" shape="circle" icon="android-search" size="small"
                                        style="margin-bottom: 5px" @click="queryWithConditions">
                                    查詢
                                </Button>
                                <Button type="primary" shape="circle" icon="android-refresh" size="small"
                                        style="margin-bottom: 5px" @click="resetConditions">
                                    重置
                                </Button>
                            </FormItem>
                        </Form>
                        <Table ref="orga_table_ref" border stripe :columns="table_default_cols" :data="table_list"
                               :loading="table_loading"></Table>
                        <div style="margin:10px;overflow:hidden;">
                            <div style="float: right;">
                                <Page :total="totalPages" :current="pageNum"
                                      :page-size="pageSize" @on-change="changePageNum"
                                      @on-page-size-change="changePageSize"
                                      show-total show-sizer transfer>
                                </Page>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <Modal v-model="AddOrgaModal" title="新建机构"
               :styles="{display: 'flex', alignItems:'left', justifyContent:'center'}"
               @on-visible-change="initCurrentOrga">
            <div class="cropper-preiveiw-container">
                <Form ref="AddOrgaFormRef" :model="orga" :label-width="150" :rules="addOrgaRuleCustom">
                    <FormItem label="机构所在地区" prop="sbankareacode">
                        <Select v-model="orga.sbankareacode" style="width:320px" @on-change="getBankCity">
                            <Option v-for="(item, index) in bankAreaList" :value="item.sbankareacode"
                                    :key="index">
                                {{item.sareaname}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="机构所在城市" prop="sbankcitycode">
                        <Select v-model="orga.sbankcitycode" style="width:320px">
                            <Option v-for="(item, index) in bankCityList" :value="item.sbankcitycode"
                                    :key="index">
                                {{item.scityname}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="机构类别" prop="sbankkind">
                        <Select v-model="orga.sbankkind" size="small" style="width: 320px"
                                @on-change="getBankTypes">
                            <Option v-for="(item, index) in bankKindList" :value="item.sbankkind" :key="index">
                                {{item.skindname}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="机构行别" prop="sbanktypecode">
                        <Select v-model="orga.sbanktypecode" size="small" style="width: 320px">
                            <Option v-for="(item, index) in bankTypeList" :value="item.sbanktypecode"
                                    :key="index">
                                {{item.stypename}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="直属上级行行代码" prop="stopbankcode">
                        <Input v-model="orga.stopbankcode" type="text"/>
                    </FormItem>
                    <FormItem label="所属人民银行" prop="spbcode">
                        <Select v-model="orga.spbcode" size="small" style="width: 320px">
                            <Option v-for="(item, index) in pbcList" :value="item.sbankcode" :key="index">
                                {{item.sbankname}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="机构代码" prop="sbankcode">
                        <Input v-model="orga.sbankcode" type="text"/>
                    </FormItem>
                    <FormItem label="机构名称" prop="sbankname">
                        <Input v-model="orga.sbankname" type="text"/>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="default" @click="cancelAddOrga">
                    取消
                </Button>
                <Button type="primary" @click="addOrgaConfirm">
                    确定
                </Button>
            </div>
        </Modal>
        <Modal v-model="UpdateOrgaModal" title="修改机构"
               :styles="{display: 'flex', alignItems:'left', justifyContent:'center'}"
               @on-visible-change="initCurrentOrga">
            <div class="cropper-preiveiw-container">
                <Form ref="UpdateOrgaFormRef" :model="orga" :label-width="150" :rules="updateOrgaRuleCustom">
                    <FormItem label="所属人民银行" prop="spbcode">
                        <Select v-model="orga.spbcode" size="small" style="width: 320px">
                            <Option v-for="(item, index) in pbcList" :value="item.sbankcode" :key="index">
                                {{item.sbankname}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem label="机构代码" prop="sbankcode">
                        <Input v-model="orga.sbankcode" type="text" disabled/>
                    </FormItem>
                    <FormItem label="直属上级行行代码" prop="stopbankcode">
                        <Input v-model="orga.stopbankcode" type="text"/>
                    </FormItem>
                    <FormItem label="机构状态" prop="sbankstate">
                        <i-switch v-model="orga.sbankstate" size="large" true-value="0" false-value="1">
                            <span slot="open">启用</span>
                            <span slot="close">停用</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="机构名称" prop="sbankname">
                        <Input v-model="orga.sbankname" type="text"/>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="default" @click="cancelUpdateOrga">
                    取消
                </Button>
                <Button type="primary" @click="updateOrgaConfirm">
                    确定
                </Button>
            </div>
        </Modal>
    </div>
</template>
<script src="../../viewjs/orga.js"></script>
