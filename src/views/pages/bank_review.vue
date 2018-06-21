<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        height: 100%;
    }
    .layout-logo{
        width: 40px;
        height: 40px;
        /*background: #5b6270;*/
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }
    .layout-title{
        height: 40px;
        font-size: large;
        float: left;
        position: relative;
        color: white;
        align-content: center;
        left: 60px;
    }
    .layout-assistant{
        width: 550px;
        margin: 0 auto;
        height: inherit;
        font-size: small;
    }
    .layout-breadcrumb{
        padding: 0px 15px 0;
    }
    .layout-content{
        height: 100%;
        width: 100%;
        margin: 0px;
        overflow: hidden;
        background: #fff;
        border-radius: 4px;
    }
    .layout-content-main{
        padding: 5px;
    }
    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
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
        /*margin-bottom: 5px;*/
        margin-top: 2px;
        text-align: center;
        width: inherit;
    }
    .cropper-container{
        height: 100%;
    }
    .cropper-preiveiw-container{
        text-align: center;
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
</style>
<template>
    <div class="layout">
        <Menu mode="horizontal" style="width: 100%; " v-show="!ifEdit" theme="light" active-name="accelerate" @on-select="changeTab">
            <div class="layout-assistant">
                <MenuItem name="accelerate">
                    <Badge :count="accelerate_Num" class-name="demo-badge-alone">
                        <Icon type="android-plane"></Icon>
                        加急通道<span v-show="accelerate_Num!==0">&nbsp;&nbsp;&nbsp;</span>
                    </Badge>
                </MenuItem>
                <MenuItem name="review">
                    <Badge :count="review_Num">
                    <Icon type="eye"></Icon>
                    待复核<span v-show="review_Num!==0">&nbsp;&nbsp;&nbsp;</span>
                    </Badge>
                </MenuItem>
                <MenuItem name="recheck">
                    <Icon type="ios-circle-outline"></Icon>
                    待审核
                </MenuItem>
                <!--<MenuItem name="pass">-->
                    <!--<Icon type="android-checkbox-outline-blank"></Icon>-->
                    <!--待通过-->
                <!--</MenuItem>-->
                <MenuItem name="passed">
                    <Icon type="ios-list"></Icon>
                    已通过
                </MenuItem>
                <MenuItem name="stoped">
                    <Icon type="stop"></Icon>
                    已终止
                </MenuItem>
            </div>
        </Menu>
        <div class="layout-breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem to="/bank_review">
                    <Icon type="ios-home-outline"></Icon> 主页
                </BreadcrumbItem>
                <BreadcrumbItem to="/bank_review">
                    <Icon type="social-buffer-outline"></Icon> 影像复核
                </BreadcrumbItem>
                <BreadcrumbItem to="/bank_review">
                    <Icon type="pound"></Icon> {{breadCrumb}}
                </BreadcrumbItem>
                <BreadcrumbItem to="/bank_review" v-show="ifEdit || ifLook">
                    <Button @click="showOperators" type="info" shape="circle" size="small">经办人</Button>
                </BreadcrumbItem>
                <BreadcrumbItem v-show="ifEdit">
                    <Button @click="returnBack" type="primary" shape="circle" size="small">返回</Button>
                </BreadcrumbItem>
            </Breadcrumb>
        </div>
        <!--<div class="layout-breadcrumb">-->
            <!--<Breadcrumb>-->
                <!--<BreadcrumbItem href="#">{{user_info.name}}</BreadcrumbItem>-->
                <!--<BreadcrumbItem href="#">{{user_info.unit}}</BreadcrumbItem>-->
                <!--<BreadcrumbItem>{{page_status}}</BreadcrumbItem>-->
            <!--</Breadcrumb>-->
        <!--</div>-->
        <div class="layout-content">
            <div class="layout-content-main">
                <template>
                    <div v-show="!ifEdit">
                        <Table stripe :columns="table_cols" :data="table_list" :loading="table_loading"></Table>
                        <div style="margin:10px;overflow:hidden;float:right;">
                            <!--<div style="float:right;">-->
                                <Page :total="totalPages" :current="currentPage"
                                      :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize"
                                      show-total show-sizer transfer></Page>
                            <!--</div>-->
                        </div>
                    </div>
                </template>
                <template>
                        <div class="cropper-container" v-show="ifEdit">
                            <Row type="flex" jutisfy="center" :gutter="6">
                                <!--<Col span="1">-->
                                    <!--<div style="width: 100%">-->
                                    <!--</div>-->
                                <!--</Col>-->
                                <Col span="8">
                                    <div class="main-file">
                                        <div style="display: flex">
                                            <Tag color="blue" type="border">主件区</Tag>
                                            <div class="tool-bar">
                                                <Button type="primary" @click="zoom(0.1, 'main')" class="index" size="small" :disabled="!main_img_url">放大</Button>
                                                <Button type="primary" @click="zoom(-0.1, 'main')" class="index" size="small" :disabled="!main_img_url">缩小</Button>
                                                <Button type="primary" @click="rotate('main')" class="index" size="small" :disabled="!main_img_url">旋转</Button>
                                            </div>
                                        </div>
                                        <div class="myCropper-workspace" v-show="!main_img_url">
                                            <div class="myCropper-words">请点击按钮选择申请书</div>
                                        </div>
                                        <div class="img-container">
                                            <img id="image_main" v-show="img_hidden" :src="main_img_url" />
                                        </div>
                                    </div>
                                </Col>
                                <Col span="8">
                                    <div class="attachment-files">
                                        <div style="display: flex">
                                            <Tag color="blue" type="border">附件区</Tag>
                                            <div class="tool-bar">
                                                <Button type="primary" @click="zoom(0.1, 'attachment')" class="index" size="small":disabled="!attachment_img_url">放大</Button>
                                                <Button type="primary" @click="zoom(-0.1, 'attachment')" class="index" size="small":disabled="!attachment_img_url">缩小</Button>
                                                <Button type="primary" @click="rotate('attachment')" class="index" size="small":disabled="!attachment_img_url">旋转</Button>
                                            </div>
                                        </div>
                                        <div class="myCropper-workspace" v-show="!attachment_img_url">
                                            <div class="myCropper-words">请点击按钮批量选择附件</div>
                                        </div>
                                        <div class="img-container" ref="attachment">
                                            <img id="image_attachment" v-show="img_hidden" :src="attachment_img_url" />
                                        </div>
                                    </div>
                                </Col>
                                <Col span="3">
                                    <div class="attachment-imgs">
                                        <div>
                                            <Tag color="green" type="border">附件列表</Tag>
                                        </div>
                                        <ul v-if="dest_img_files.length" class="img-list" :style="'height:'+img_list_height+'px'" >
                                            <li v-for="(img, index) in dest_img_files" :key="index+img.date" style="display: flex">
                                                <my-dest-image :imgfile="img" :index="index" @prepareImage="prepareImage" @initCropperImage="initCropperImage" @updateImgDestFiles="updateImgDestFiles" ></my-dest-image>
                                                <div style="text-align: left;height: 50px">
                                                    <div>
                                                        <Tooltip :content="img.number" placement="bottom">
                                                            <Tag style="width: 50px; size: 2px" color = green>
                                                                {{img.number}}
                                                            </Tag>
                                                        </Tooltip>
                                                    </div>
                                                    <div>
                                                        <Tooltip :content="img.type" placement="bottom">
                                                            <Tag style="width: auto; size: 2px" type="border">
                                                                {{img.type}}
                                                            </Tag>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col span="5">
                                    <div class="informations">
                                        <div>
                                            <Tag color="blue" type="border">基本信息区</Tag>
                                        </div>
                                        <Form :model="formItem" :label-width="100">
                                            <!--<FormItem label="流水号">-->
                                                <!--<p>-->
                                                    <!--{{workIndex.stransactionnum}}-->
                                                <!--</p>-->
                                            <!--</FormItem>-->
                                            <FormItem label="业务类别">
                                                <p>
                                                    {{workIndex.sbusinesscategory}}
                                                </p>
                                            </FormItem>
                                            <FormItem label="账户种类">
                                                <p>
                                                    {{workIndex.saccounttype}}
                                                </p>
                                            </FormItem>
                                            <FormItem label="开户行机构代码">
                                                <p>
                                                    {{workIndex.sbankcode}}
                                                </p>
                                            </FormItem>
                                            <FormItem label="开户行机构名称">
                                                <p>
                                                    {{workIndex.sbankname}}
                                                </p>
                                            </FormItem>
                                             <FormItem label="存款人名称">
                                                 <p>
                                                     {{workIndex.sdepositorname}}
                                                 </p>
                                            </FormItem>
                                            <FormItem label="审批意见" v-show="tabSelected === 1">
                                                <Dropdown style="margin-left: 20px" placement="top" @on-click="onSelectOpinions" transfer>
                                                    <Button type="success" size="small">
                                                        备选意见
                                                        <Icon type="arrow-up-b"></Icon>
                                                    </Button>
                                                    <DropdownMenu v-for="(item,index) in reviewOpinion" :key="index" slot="list">
                                                        <DropdownItem :name="index">{{item}}</DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                                <Input style="padding-top: 5px" v-model="review" type="textarea" :row="5" placeholder="请输入审批意见"></Input>
                                            </FormItem>
                                            <FormItem v-show="tabSelected === 1">
                                                <Button @click="updateWorkIndexByApprovalStateBack">退回</Button>
                                                <Button @click="updateWorkIndexByApprovalState" type="primary">提交人行</Button>
                                            </FormItem>
                                        </Form>
                                    </div>
                                </Col>
                                <!--<Col span="1">-->
                                    <!--<div style="width: 100%">-->
                                    <!--</div>-->
                                <!--</Col>-->
                            </Row>
                        </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script src="../../viewjs/bank_review.js"></script>
