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
    .layout-title {
        height: 40px;
        font-size: large;
        float: left;
        position: relative;
        color: white;
        align-content: center;
        left: 60px;
    }
    .layout-assistant{
        width: 800px;
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
        /*padding-left: 15px;*/
        /*margin-right: 10px;*/
        float: left;
        position: relative;
        text-align: center;
    }
    .img-list{
        display: inline-block;
        text-align: center;
        width: inherit;
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
        text-align: left;
    }
    .tool-bar Button{
        margin-right: 3px;
        margin-top: 2px;
        /*margin-bottom: 5px;*/
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
        /*max-height: 531px; !*531 708*!*/
        min-height: 297px;
        /*max-width: 390px; !*390 520*!*/
        min-width: 210px;
        display: block;
    }
    /*.cropper-preiveiw-container .img-container{*/
        /*max-height: 531px; !*531 708*!*/
        /*min-height: 297px;*/
        /*max-width: 390px; !*390 520*!*/
        /*min-width: 210px;*/
        /*display: block;*/
    /*}*/
</style>
<style>
    .ivu-select-dropdown {
        max-height: 500px !important;
    }
    .ivu-tooltip-inner {
        white-space: normal !important;
    }
    .myDiv .ivu-form-item {
        margin-bottom:10px !important;
    }
</style>
<template>
    <div class="layout">
        <div style="text-align: center" v-show="!ifEdit">
            <ButtonGroup>
                <template>
                    <Dropdown @on-click="onSelectOpinions" v-for="(item, index) in businessList" :key="index" transfer>
                        <Button type="text" shape="circle" size="large">
                            {{item.businessCategory}}
                            <Icon type="arrow-down-b"></Icon>
                        </Button>
                        <DropdownMenu v-for="(type, index) in item.accountType" :key="index" slot="list">
                            <DropdownItem :name="item.businessCategory + ':' +type">
                                {{type}}
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </template>
            </ButtonGroup>
        </div>
        <Menu mode="horizontal" style="width: 100%; " v-show="!ifEdit" theme="light" active-name="edit" @on-select="changeTab">
            <div class="layout-assistant">
                <MenuItem name="edit">
                    <Badge :count="edit_Num">
                        <Icon type="edit"></Icon>
                        待编辑<span v-show="edit_Num!==0">&nbsp;&nbsp;&nbsp;</span>
                    </Badge>
                </MenuItem>
                <MenuItem name="returned">
                    <Badge :count="returned_Num">
                        <Icon type="arrow-return-left"></Icon>
                        待整改<span v-show="returned_Num!==0">&nbsp;&nbsp;&nbsp;</span>
                    </Badge>
                </MenuItem>
                <MenuItem name="review" v-show="ifHasBankReview">
                    <Icon type="eye"></Icon>
                    待本级主管复核
                </MenuItem>
                <MenuItem name="recheck">
                    <Icon type="ios-circle-outline"></Icon>
                    待人行监督
                </MenuItem>
                <MenuItem name="passed">
                    <Icon type="ios-list"></Icon>
                    已结束
                </MenuItem>
                <MenuItem name="pass">
                    <Icon type="android-checkbox-outline-blank"></Icon>
                    整改业务
                </MenuItem>
            </div>
        </Menu>
        <div class="layout-breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem to="/SV/sv_bank_entry">
                    <Icon type="ios-home-outline"></Icon> 主页
                </BreadcrumbItem>
                <BreadcrumbItem to="/SV/sv_bank_entry">
                    <Icon type="social-buffer-outline"></Icon> 影像录入
                </BreadcrumbItem>
                <BreadcrumbItem to="/SV/sv_bank_entry">
                    <Icon type="pound"></Icon> {{breadCrumb}}
                </BreadcrumbItem>
                <!--<BreadcrumbItem to="/bank_entry" v-show="ifEdit">-->
                    <!--{{workIndex.stransactionnum}}-->
                <!--</BreadcrumbItem>-->
                <BreadcrumbItem to="/SV/sv_bank_entry" v-show="ifEdit">
                    {{workIndex.sbusinesscategory}}
                </BreadcrumbItem>
                <BreadcrumbItem to="/SV/sv_bank_entry" v-show="ifEdit">
                    {{workIndex.saccounttype}}
                </BreadcrumbItem>
                <BreadcrumbItem to="/SV/sv_bank_entry" v-show="ifEdit">
                    {{workIndex.sdepositorname}}
                </BreadcrumbItem>
                <BreadcrumbItem to="/SV/sv_bank_entry" v-show="ifEdit">
                    {{workIndex.saccountnum}}
                </BreadcrumbItem>
                <BreadcrumbItem to="/SV/sv_bank_entry" v-show="ifEdit">
                    {{workIndex.suniquesocialcreditcode}}
                </BreadcrumbItem>
                <BreadcrumbItem to="/SV/sv_bank_entry" v-show="ifEdit && workIndex.sbusinesscategory == '存款人密码重置'">
                    存款人密码：{{workIndex.sapprovalcode}}
                </BreadcrumbItem>
                <!--<BreadcrumbItem v-show="ifEdit && !ifLook">-->
                    <!--<Switch v-model="workIndex.sbusinessemergency" true-value="1" false-value="0" size="large">-->
                        <!--<span slot="open">加急</span>-->
                        <!--<span slot="close">加急</span>-->
                    <!--</Switch>-->
                <!--</BreadcrumbItem>-->
                <!--<BreadcrumbItem v-show="ifEdit && !ifLook">-->
                    <!--<Button @click="commitWorkIndexByApprovalState" type="primary" shape="circle" v-show="!ifLook && ifHasBankReview" :disabled="!attachment_img_url || !main_img_url" size="small">提交本行复核</Button>-->
                    <!--<Button @click="commitWorkIndexByApprovalState('ren')" type="primary" shape="circle" size="small" v-show="!ifLook && !ifHasBankReview" :disabled="!attachment_img_url || !main_img_url">提交人行审核</Button>-->
                <!--</BreadcrumbItem>-->
                <BreadcrumbItem to="/SV/sv_bank_entry" v-show="ifEdit || ifLook">
                    <Button @click="showOperators" type="info" shape="circle" size="small">经办人</Button>
                </BreadcrumbItem>
                <BreadcrumbItem v-show="latestReview!='' && ifLook">
                    <Button @click="showLastReview" type="info" shape="circle" size="small">审核意见</Button>
                </BreadcrumbItem>
                <BreadcrumbItem v-show="ifEdit">
                    <Button @click="returnBack" type="primary" shape="circle" size="small">返回</Button>
                </BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div class="layout-content">
            <div class="layout-content-main">
                <template>
                    <Row>
                        <Col span="24">
                            <div v-show="!ifEdit" style="text-align: center" class="myDiv">
                                <!--<Button v-show="tabSelected === 1 && !accelerated" type="primary" shape="circle" style="margin-bottom: 5px" @click="newTask">-->
                                    <!--<Icon type="plus-circled"></Icon>-->
                                    <!--新建任务-->
                                <!--</Button>-->
                                <Form :model="formSearch" label-position="right" :label-width="100" inline>
                                    <FormItem label="存款人名称" style="margin-bottom: 10px !important">
                                        <Input v-model="formSearch.fDepositorName" size="small" style="width: 220px"></Input>
                                    </FormItem>
                                    <FormItem label="业务类别">
                                        <Select v-model="formSearch.fBusinessType" placeholder="业务类别" style="width:220px" size="small" transfer>
                                            <Option v-for="(item, index) in businessLists" :value="item" :key="index">
                                                {{ item}}
                                            </Option>
                                        </Select>
                                    </FormItem>
                                    <FormItem label="操作" style="margin-bottom: 10px !important">
                                        <Button type="primary" shape="circle" size="small" style="margin-bottom: 5px" @click="searchByConditions">
                                            <Icon type="ios-search"></Icon>
                                            搜索
                                        </Button>
                                        <Button type="text" shape="circle" size="small" style="margin-bottom: 5px" @click="resetConditions">
                                            <Icon type="ios-reload"></Icon>
                                            重置
                                        </Button>
                                    </FormItem>
                                </Form>
                                <Table stripe :columns="table_cols" :data="table_list" :loading="table_loading"></Table>
                                <div style="margin:10px;overflow:hidden;float:right;">
                                    <!--<div style="float:right;">-->
                                    <Page :total="totalPages" :current="currentPage"
                                          :page-size="pageSize" @on-change="changePage" @on-page-size-change="changePageSize"
                                          show-total show-sizer transfer></Page>
                                    <!--</div>-->
                                </div>
                            </div>
                        </Col>
                    </Row>
                </template>
                <template>
                        <div class="cropper-container" v-show="ifEdit">
                            <Row type="flex" jutisfy="center" :gutter="0">
                                <!--<Col span="1">-->
                                    <!--<div style="width: 100%">-->
                                    <!--</div>-->
                                <!--</Col>-->
                                <Col span="8">
                                    <div class="main-file">
                                        <div style="display: flex">
                                            <Tag>主件区</Tag>
                                            <div class="tool-bar">
                                                <Button type="primary" @click="zoom(0.1, 'main')" class="index" size="small" :disabled="(!main_img_url || ifSaved) && !ifLook">放大</Button>
                                                <Button type="primary" @click="zoom(-0.1, 'main')" class="index" size="small" :disabled="(!main_img_url || ifSaved) && !ifLook">缩小</Button>
                                                <Button type="primary" @click="rotate('main')" class="index" size="small" :disabled="(!main_img_url || ifSaved) && !ifLook">旋转</Button>
                                                <Button type="primary" v-show="!cropped_main && !ifLook" @click="showCrop('main')" class="index" size="small" :disabled="!main_img_url || ifSaved" >剪裁</Button>
                                                <Button type="primary" v-show="cropped_main" @click="cropFinish('main')" class="index" size="small" >完成剪裁</Button>
                                                <Button type="primary" v-show="cropped_main" @click="cropCancel('main')" class="index" size="small" >取消剪裁</Button>
                                                <input id="upload-input" accept="image/*" type="file" @change="handleFileChange" ref="inputer_main" />
                                                <Button type="primary" icon="ios-cloud-upload-outline" @click="uploadFile" class="index" size="small" :disabled="ifSaved" v-show="!ifLook">选择</Button>
                                                <Button type="success" @click="showPreviewModal('main')" size="small" :disabled="!main_img_url || ifSaved" v-show="!ifLook"> 保存</Button>
                                            </div>
                                        </div>
                                        <div class="myCropper-workspace" v-show="!main_img_url">
                                            <div class="myCropper-words">
                                                <Icon type="ios-cloud-upload" size="52" style="padding-bottom: 5px"></Icon>
                                                <div>
                                                    主件编辑区
                                                </div>
                                            </div>
                                        </div>
                                        <div class="img-container">
                                            <img id="image_main" v-show="img_hidden" :src="main_img_url" />
                                        </div>
                                        <!--<div class="tool-bar">-->
                                            <!--<Button type="primary" @click="zoom(0.1, 'main')" class="index" size="small" :disabled="(!main_img_url || ifSaved) && !ifLook">放大</Button>-->
                                            <!--<Button type="primary" @click="zoom(-0.1, 'main')" class="index" size="small" :disabled="(!main_img_url || ifSaved) && !ifLook">缩小</Button>-->
                                            <!--<Button type="primary" @click="rotate('main')" class="index" size="small" :disabled="(!main_img_url || ifSaved) && !ifLook">旋转</Button>-->
                                            <!--<Button type="primary" v-show="!cropped_main && !ifLook" @click="showCrop('main')" class="index" size="small" :disabled="!main_img_url || ifSaved" >剪裁</Button>-->
                                            <!--<Button type="primary" v-show="cropped_main" @click="cropFinish('main')" class="index" size="small" >完成剪裁</Button>-->
                                            <!--<Button type="primary" v-show="cropped_main" @click="cropCancel('main')" class="index" size="small" >取消剪裁</Button>-->
                                            <!--<input id="upload-input" accept="image/*" type="file" @change="handleFileChange" ref="inputer_main" />-->
                                            <!--<Button type="ghost" icon="ios-cloud-upload-outline" @click="uploadFile" class="index" size="small" :disabled="ifSaved" v-show="!ifLook">选择申请书</Button>-->
                                            <!--<Button type="success" @click="showPreviewModal('main')" size="small" :disabled="!main_img_url || ifSaved" v-show="!ifLook"> 保存</Button>-->
                                        <!--</div>-->
                                    </div>
                                </Col>
                                <Col span="8">
                                    <div class="attachment-files">
                                        <div style="display: flex">
                                            <Tag>附件区</Tag>
                                            <div class="tool-bar">
                                                <Button type="primary" @click="zoom(0.1, 'attachment')" class="index" size="small":disabled="!attachment_img_url && !ifLook">放大</Button>
                                                <Button type="primary" @click="zoom(-0.1, 'attachment')" class="index" size="small":disabled="!attachment_img_url && !ifLook">缩小</Button>
                                                <Button type="primary" @click="rotate('attachment')" class="index" size="small":disabled="!attachment_img_url && !ifLook">旋转</Button>
                                                <Button type="primary" v-show="!cropped_attachment && !ifLook" @click="showCrop('attachment')" class="index" size="small" :disabled="!attachment_img_url">剪裁</Button>
                                                <Button type="primary" v-show="cropped_attachment" @click="cropFinish('attachment')" class="index" size="small">完成剪裁</Button>
                                                <Button type="primary" v-show="cropped_attachment" @click="cropCancel('attachment')" class="index" size="small">取消剪裁</Button>
                                                <input id="upload-multiple-input" accept="image/*" type="file" @change="handleMultipleFileChange" ref="inputer_attachment" multiple/>
                                                <Button type="primary" icon="ios-cloud-upload-outline" @click="uploadMultipleFile" class="index" size="small" v-show="!ifLook">选择</Button>
                                                <!--<Button type="success" @click="showPreviewModal('attachment')" size="small" :disabled="!attachment_img_url" v-show="!ifLook"> 保存</Button>-->
                                                <!--<Button @click="updateWorkIndexByApprovalState" type="primary" shape="circle" size="small" v-show="!ifLook" :disabled="!attachment_img_url && !main_img_url">提交主管</Button>-->
                                                <!--<Button @click="updateWorkIndexByApprovalState('ren')" type="primary" shape="circle" size="small" v-show="!ifLook" :disabled="!attachment_img_url && !main_img_url">提交人行</Button>-->
                                            </div>
                                        </div>
                                        <div class="myCropper-workspace" v-show="!attachment_img_url">
                                            <div class="myCropper-words">
                                                <Icon type="ios-cloud-upload" size="52" style="padding-bottom: 5px"></Icon>
                                                <div>
                                                    附件编辑区
                                                </div>
                                            </div>
                                        </div>
                                        <div class="img-container" ref="attachment">
                                            <img id="image_attachment" v-show="img_hidden" :src="attachment_img_url" />
                                        </div>
                                        <!--<div class="tool-bar">-->
                                            <!--<Button type="primary" @click="zoom(0.1, 'attachment')" class="index" size="small":disabled="!attachment_img_url && !ifLook">放大</Button>-->
                                            <!--<Button type="primary" @click="zoom(-0.1, 'attachment')" class="index" size="small":disabled="!attachment_img_url && !ifLook">缩小</Button>-->
                                            <!--<Button type="primary" @click="rotate('attachment')" class="index" size="small":disabled="!attachment_img_url && !ifLook">旋转</Button>-->
                                            <!--<Button type="primary" v-show="!cropped_attachment && !ifLook" @click="showCrop('attachment')" class="index" size="small" :disabled="!attachment_img_url">剪裁</Button>-->
                                            <!--<Button type="primary" v-show="cropped_attachment" @click="cropFinish('attachment')" class="index" size="small">完成剪裁</Button>-->
                                            <!--<Button type="primary" v-show="cropped_attachment" @click="cropCancel('attachment')" class="index" size="small">取消剪裁</Button>-->
                                            <!--<input id="upload-multiple-input" accept="image/*" type="file" @change="handleMultipleFileChange" ref="inputer_attachment" multiple/>-->
                                            <!--<Button type="ghost" icon="ios-cloud-upload-outline" @click="uploadMultipleFile" class="index" size="small" v-show="!ifLook">选择附件</Button>-->
                                            <!--&lt;!&ndash;<Button type="success" @click="showPreviewModal('attachment')" size="small" :disabled="!attachment_img_url" v-show="!ifLook"> 保存</Button>&ndash;&gt;-->
                                            <!--&lt;!&ndash;<Button @click="updateWorkIndexByApprovalState" type="primary" shape="circle" size="small" v-show="!ifLook" :disabled="!attachment_img_url && !main_img_url">提交主管</Button>&ndash;&gt;-->
                                            <!--&lt;!&ndash;<Button @click="updateWorkIndexByApprovalState('ren')" type="primary" shape="circle" size="small" v-show="!ifLook" :disabled="!attachment_img_url && !main_img_url">提交人行</Button>&ndash;&gt;-->
                                        <!--</div>-->
                                    </div>
                                </Col>
                                <Col span="1.5" v-show="!ifLook">
                                    <div class="attachment-imgs" >
                                        <div style="text-align: left;">
                                            <Tag>待选附件</Tag>
                                        </div>
                                        <ul v-if="src_img_files.length" class="img-list" :style="'height:'+img_list_height+'px'" >
                                            <li v-for="(img, index) in src_img_files" :key="index+img.lastModified">
                                                <my-src-image :imgfile="img" :index="index" @prepareImage="prepareImage"  @deleteImg="deleteImg"></my-src-image>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col span="3" v-show="!ifLook">
                                    <div class="attachment-imgs">
                                        <div style="text-align: left;">
                                            <Tag>附件类型</Tag>
                                        </div>
                                        <ul v-if="certi_kind_list.length" class="img-list" :style="'height:'+img_list_height/2+'px'" style="text-align: left; width: inherit" >
                                            <li v-for="(item, index) in certi_kind_list" :value="item.sProofName" :key="index">
                                                <Tooltip placement="bottom">
                                                    <div slot="content">
                                                        {{item.sProofName}}
                                                    </div>
                                                    <Button style="max-width: 200px" type="text" @click="showPreviewModal('attachment', item.sProofName, index)" size="small" :disabled="!attachment_img_url" v-show="!ifLook">
                                                        <span v-if="item.sProofAmount !== '3'" style="color: red;font-weight:bold;">*</span> {{item.sProofName}}
                                                    </Button>
                                                </Tooltip>
                                            </li>
                                        </ul>
                                        <div  :style="'height:'+img_list_height/2+'px'">
                                            <Card v-show="ifEdit && !ifLook" :style="'height:'+img_list_height/2+'px'">
                                                <Form>
                                                    <!--<FormItem>-->
                                                        <!--<Switch v-model="workIndex.sbusinessemergency" true-value="1" false-value="0" size="large">-->
                                                            <!--<span slot="open">加急</span>-->
                                                            <!--<span slot="close">加急</span>-->
                                                        <!--</Switch>-->
                                                    <!--</FormItem>-->
                                                    <FormItem v-show="latestReview!=''">
                                                        <Button @click="showLatestReview" type="error" shape="circle" size="small">退回理由</Button>
                                                    </FormItem>
                                                    <FormItem>
                                                        <Button @click="commitWorkIndexByApprovalState" type="primary" shape="circle" v-show="!ifLook && ifHasBankReview" :disabled="!attachment_img_url || !main_img_url" size="small">提交本行复核</Button>
                                                        <Button @click="commitWorkIndexByApprovalState('ren')" type="primary" shape="circle" size="small" v-show="!ifLook && !ifHasBankReview" :disabled="!attachment_img_url || !main_img_url">提交人行审核</Button>
                                                    </FormItem>
                                                </Form>
                                            </Card>
                                        </div>
                                    </div>
                                </Col>
                                <Col span="3">
                                    <div class="attachment-imgs">
                                        <div style="text-align: left;">
                                            <Tag color="green" type="border">已上传</Tag>
                                        </div>
                                        <ul v-if="dest_img_files.length" class="img-list" :style="'height:'+img_list_height+'px'" >
                                            <li v-for="(img, index) in dest_img_files" :key="index+img.date+img.sid" style="display:flex">
                                                <my-dest-image :imgfile="img" :index="index" :ifLook="ifLook" @showCheckModal="showCheckModal"
                                                               @deleteImgFromDB="deleteImgFromDB" @initCropperImage="initCropperImage"
                                                @updateImgDestFiles="updateImgDestFiles"></my-dest-image>
                                                <!--<Tooltip :content="img.type" placement="bottom-end">-->
                                                    <!--<Tag style="width: 50px; size: 2px" color = green>-->
                                                        <!--{{img.number}}-->
                                                    <!--</Tag>-->
                                                <!--</Tooltip>-->
                                                <div style="text-align: left;height: 50px">
                                                    <div>
                                                        <Tooltip content="点击下载" placement="bottom">
                                                            <Tag style="width: 50px; size: 2px" color = green @click.native="downloadImg(img)">
                                                                {{img.number}}
                                                            </Tag>
                                                        </Tooltip>
                                                    </div>
                                                    <div>
                                                        <Tooltip :content="img.type" placement="bottom">
                                                            <Tag style="width: 100%; size: 2px" type="border">
                                                                {{img.type}}
                                                            </Tag>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <!--<Col span="1" v-show="ifLook">-->
                                    <!--<div style="width: 100%">-->
                                    <!--</div>-->
                                <!--</Col>-->
                                <!--<Col span="8">-->
                                    <!--<div class="informations">-->
                                        <!--<div>-->
                                            <!--<Tag color="blue" type="border">基本信息录入区</Tag>-->
                                        <!--</div>-->
                                        <!--<Form :model="formItem" :label-width="100">-->
                                            <!--<FormItem label="流水号">-->
                                                <!--<p>-->
                                                    <!--{{workIndex.stransactionnum}}-->
                                                <!--</p>-->
                                            <!--</FormItem>-->
                                            <!--<FormItem label="业务类别">-->
                                                <!--<p>-->
                                                    <!--{{workIndex.sbusinesscategory}}-->
                                                <!--</p>-->
                                            <!--</FormItem>-->
                                            <!--<FormItem label="账户种类">-->
                                                <!--<p>-->
                                                    <!--{{workIndex.saccounttype}}-->
                                                <!--</p>-->
                                            <!--</FormItem>-->
                                            <!--<FormItem label="开户行机构代码">-->
                                                <!--<p>-->
                                                    <!--{{workIndex.sbankcode}}-->
                                                <!--</p>-->
                                            <!--</FormItem>-->
                                            <!--<FormItem label="开户行机构名称">-->
                                                <!--<p>-->
                                                    <!--{{workIndex.sbankname}}-->
                                                <!--</p>-->
                                            <!--</FormItem>-->
                                            <!--<FormItem label="录入员姓名">-->
                                                <!--<p>-->
                                                    <!--{{workIndex.supusercode + " : " + workIndex.supusername}}-->
                                                <!--</p>-->
                                            <!--</FormItem>-->
                                             <!--<FormItem label="存款人名称">-->
                                                <!--<Input v-show="!ifLook" v-model="workIndex.sdepositorname" type="textarea" :row="10" :placeholder="workIndex.sdepositorname"></Input>-->
                                                 <!--<p v-show="ifLook">-->
                                                     <!--{{workIndex.sdepositorname}}-->
                                                 <!--</p>-->
                                            <!--</FormItem>-->
                                            <!--<FormItem v-show="latestReview !='' " label="最新审核意见">-->
                                                <!--<p style="color: red">-->
                                                    <!--{{latestReview}}-->
                                                <!--</p>-->
                                            <!--</FormItem>-->
                                            <!--<FormItem v-show="!ifLook">-->
                                                <!--<Button @click="updateWorkIndexByDepositor">保存信息</Button>-->
                                                <!--<Tooltip content="温馨提示：先保存信息再提交" placement="top">-->
                                                    <!--<Button @click="updateWorkIndexByApprovalState" type="primary">提交任务</Button>-->
                                                <!--</Tooltip>-->
                                            <!--</FormItem>-->
                                        <!--</Form>-->
                                    <!--</div>-->
                                <!--</Col>-->
                                <!--<Col span="0.5">-->
                                    <!--<div style="width: 100%">-->
                                        <!--&lt;!&ndash;<Button @click="updateWorkIndexByApprovalState" type="primary">提交任务</Button>&ndash;&gt;-->
                                    <!--</div>-->
                                <!--</Col>-->
                            </Row>
                        </div>
                </template>
            </div>
        </div>
        <Modal
        v-model="previewModal"
        :mask-closable="false"
        :closable="false"
        :styles="{display: 'flex', alignItems:'center', justifyContent:'center', top:'0px'}">
            <div class="cropper-preiveiw-container">
                <div class="img-container" :style="{height:previewModalHeight, width:previewModalWidth}">
                    <img id="image_preivew" class="cropper-hidden" :src="preview_img_url" />
                </div>
                <!--<Form v-if="showAttachSelect" ref="uploadImageForm" :model="file_type" :rules="file_type_rules" :label-width="100">-->
                    <!--<FormItem  label="附件类型" prop="file_type">-->
                        <!--<Select v-model="file_type.file_type" style="width:200px" placeholder="请选择图片种类" >-->
                            <!--<Option v-for="item in certi_kind_list" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                        <!--</Select>-->
                    <!--</FormItem>-->
                <!--</Form>-->
            </div>
            <div slot="footer">
                <Button type="text" @click="cancelUpoad">
                    取消
                </Button>
                <Button type="primary" @click="confirmUpload">
                    确定
                </Button>
            </div>
        </Modal>
        <Modal
                id="checkModal"
                :title="check_preview_info"
                v-model="checkModal"
                :mask-closable="false"
                :closable="false"
                :styles="{display: 'flex', alignItems:'center', justifyContent:'center', top:'0px'}">
            <div class="cropper-preiveiw-container">
                <div class="img-container" :style="{height:previewModalHeight, width:previewModalWidth}">
                    <img id="image_check" class="cropper-hidden" :src="preview_img_url" />
                </div>
            </div>
        </Modal>
        <Modal
                v-model="newTaskModal"
                title="新建业务"
                :styles="{display: 'flex', alignItems:'center', justifyContent:'center'}">
            <div class="cropper-preiveiw-container">
                <Form ref="newTaskForm" :model="workIndex" :label-width="100" :rules="rules">
                    <!--<FormItem label="业务类别" prop="sbusinesscategory">-->
                        <!--<Select v-model="workIndex.sbusinesscategory" style="width:200px">-->
                            <!--<Option v-for="item in businessList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                        <!--</Select>-->
                    <!--</FormItem>-->
                    <!--<FormItem label="账户种类" prop="saccounttype">-->
                        <!--<Select v-model="workIndex.saccounttype" style="width:200px">-->
                            <!--<Option v-for="item in accountTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
                        <!--</Select>-->
                    <!--</FormItem>-->
                    <FormItem label="业务类别" prop="sbusinesscategory">
                           {{workIndex.sbusinesscategory}}
                    </FormItem>
                    <FormItem label="账户种类" prop="saccounttype">
                        {{workIndex.saccounttype}}
                    </FormItem>
                    <FormItem label="存款人名称" prop="sdepositorname">
                        <Input v-model="workIndex.sdepositorname" type="textarea" :row="10" placeholder="请输入存款人名称..."></Input>
                    </FormItem>
                    <FormItem label="账号" prop="saccountnum">
                        <Input v-model="workIndex.saccountnum" type="number" :row="5" placeholder="请输入账号..."></Input>
                    </FormItem>
                    <FormItem label="社会统一信用代码" prop="suniquesocialcreditcode">
                        <Input v-model="workIndex.suniquesocialcreditcode" type="textarea" :row="5" placeholder="请输入社会统一信用代码..."></Input>
                    </FormItem>
                    <FormItem label="开户时间" prop="saccounttime">
                        <Input v-model="workIndex.saccounttime" type="date" :row="5" placeholder="2019-01-01"></Input>
                    </FormItem>
                    <FormItem label="存款人密码" v-if="workIndex.sbusinesscategory == '存款人密码重置'" prop="sapprovalcode">
                        <Input v-model="workIndex.sapprovalcode" type="textarea" :row="10" placeholder="请输入存款人密码..."></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="default" @click="cancelNewTask">
                    取消
                </Button>
                <Button type="primary" @click="confirmNewTask">
                    确定
                </Button>
            </div>
        </Modal>
        <a id="receipt"></a>
    </div>
</template>
<script src="../../../viewjs/newpages/sv_bank_entry.js"></script>
