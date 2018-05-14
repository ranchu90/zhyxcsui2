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
        width: 700px;
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
        /*margin-left: 10px;*/
        /*margin-right: 10px;*/
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
        <Menu mode="horizontal" style="width: 100%; " theme="light" active-name="edit" @on-select="changeTab">
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
                        被退回<span v-show="edit_Num!==0">&nbsp;&nbsp;&nbsp;</span>
                    </Badge>
                </MenuItem>
                <MenuItem name="review">
                    <Icon type="eye"></Icon>
                    待复核
                </MenuItem>
                <MenuItem name="accelerate">
                    <Badge :count="accelerate_Num">
                        <Icon type="android-plane"></Icon>
                        加急通道<span v-show="edit_Num!==0">&nbsp;&nbsp;&nbsp;</span>
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
            </div>
        </Menu>
        <div class="layout-breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem to="/">
                    <Icon type="ios-home-outline"></Icon> 主页
                </BreadcrumbItem>
                <BreadcrumbItem to="/bank_entry">
                    <Icon type="social-buffer-outline"></Icon> 影像录入
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Icon type="pound"></Icon> {{breadCrumb}}
                </BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div class="layout-content">
            <div class="layout-content-main">
                <template>
                    <div v-show="!ifEdit" style="text-align: center">
                        <Button v-show="tabSelected === 1 && !accelerated" type="primary" shape="circle" style="margin-bottom: 5px" @click="newTask">
                            <Icon type="plus-circled"></Icon>
                            新建任务
                        </Button>
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
                                <Col span="1">
                                    <div style="width: 100%">
                                    </div>
                                </Col>
                                <Col span="6">
                                    <div class="main-file">
                                        <div>
                                            <Tag color="blue" type="border">申请书编辑区</Tag>
                                        </div>
                                        <div class="myCropper-workspace" v-show="!main_img_url">
                                            <div class="myCropper-words">
                                                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff; padding-bottom: 5px"></Icon>
                                                <div>
                                                    请点击按钮选择申请书
                                                </div>
                                            </div>
                                        </div>
                                        <div class="img-container">
                                            <img id="image_main" v-show="img_hidden" :src="main_img_url" />
                                        </div>
                                        <div class="tool-bar">
                                            <Button type="primary" @click="zoom(0.1, 'main')" class="index" size="small" :disabled="!main_img_url || ifSaved">放大</Button>
                                            <Button type="primary" @click="zoom(-0.1, 'main')" class="index" size="small" :disabled="!main_img_url || ifSaved">缩小</Button>
                                            <Button type="primary" @click="rotate('main')" class="index" size="small" :disabled="!main_img_url || ifSaved">旋转</Button>
                                            <Button type="primary" v-show="!cropped_main" @click="showCrop('main')" class="index" size="small" :disabled="!main_img_url || ifSaved">剪裁</Button>
                                            <Button type="primary" v-show="cropped_main" @click="cropFinish('main')" class="index" size="small">完成剪裁</Button>
                                            <Button type="primary" v-show="cropped_main" @click="cropCancel('main')" class="index" size="small">取消剪裁</Button>
                                            <input id="upload-input" accept="image/*" type="file" @change="handleFileChange" ref="inputer_main" />
                                            <Button type="ghost" icon="ios-cloud-upload-outline" @click="uploadFile" class="index" size="small" :disabled="ifSaved">选择申请书</Button>
                                            <Button type="success" @click="showPreviewModal('main')" size="small" :disabled="!main_img_url || ifSaved"> 保存</Button>
                                        </div>
                                    </div>
                                </Col>
                                <Col span="6">
                                    <div class="attachment-files">
                                        <div>
                                            <Tag color="blue" type="border">附件编辑区</Tag>
                                        </div>
                                        <div class="myCropper-workspace" v-show="!attachment_img_url">
                                            <div class="myCropper-words">
                                                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff; padding-bottom: 5px"></Icon>
                                                <div>
                                                    请点击按钮批量选择附件
                                                </div>
                                            </div>
                                        </div>
                                        <div class="img-container" ref="attachment">
                                            <img id="image_attachment" v-show="img_hidden" :src="attachment_img_url" />
                                        </div>
                                        <div class="tool-bar">
                                            <Button type="primary" @click="zoom(0.1, 'attachment')" class="index" size="small":disabled="!attachment_img_url">放大</Button>
                                            <Button type="primary" @click="zoom(-0.1, 'attachment')" class="index" size="small":disabled="!attachment_img_url">缩小</Button>
                                            <Button type="primary" @click="rotate('attachment')" class="index" size="small":disabled="!attachment_img_url">旋转</Button>
                                            <Button type="primary" v-show="!cropped_attachment" @click="showCrop('attachment')" class="index" size="small" :disabled="!attachment_img_url">剪裁</Button>
                                            <Button type="primary" v-show="cropped_attachment" @click="cropFinish('attachment')" class="index" size="small">完成剪裁</Button>
                                            <Button type="primary" v-show="cropped_attachment" @click="cropCancel('attachment')" class="index" size="small">取消剪裁</Button>
                                            <input id="upload-multiple-input" accept="image/*" type="file" @change="handleMultipleFileChange" ref="inputer_attachment" multiple/>
                                            <Button type="ghost" icon="ios-cloud-upload-outline" @click="uploadMultipleFile" class="index" size="small">选择附件</Button>
                                            <Button type="success" @click="showPreviewModal('attachment')" size="small" :disabled="!attachment_img_url"> 保存</Button>
                                        </div>
                                    </div>
                                </Col>
                                <Col span="1">
                                    <div class="attachment-imgs">
                                        <div>
                                            <Tag color="yellow" type="border">附件</Tag>
                                        </div>
                                        <ul v-if="src_img_files.length" class="img-list" :style="'height:'+img_list_height+'px'" >
                                            <li v-for="(img, index) in src_img_files" :key="index+img.lastModified">
                                                <my-src-image :imgfile="img" :index="index" @prepareImage="prepareImage"  @deleteImg="deleteImg" ></my-src-image>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col span="1">
                                    <div class="attachment-imgs">
                                        <div>
                                            <Tag color="green" type="border">已保存</Tag>
                                        </div>
                                        <ul v-if="dest_img_files.length" class="img-list" :style="'height:'+img_list_height+'px'" >
                                            <li v-for="(img, index) in dest_img_files" :key="index+img.date">
                                                <my-dest-image :imgfile="img" :index="index" @showCheckModal="showCheckModal" @deleteImgFromDB="deleteImgFromDB" @initCropperImage="initCropperImage" ></my-dest-image>
                                                <Tooltip :content="img.type" placement="bottom-end">
                                                    <Tag style="width: 50px; size: 2px" color = green>
                                                        {{img.number}}
                                                    </Tag>
                                                </Tooltip>
                                            </li>
                                        </ul>
                                    </div>
                                </Col>
                                <Col span="8">
                                    <div class="informations">
                                        <div>
                                            <Tag color="blue" type="border">基本信息录入区</Tag>
                                        </div>
                                        <Form :model="formItem" :label-width="100">
                                            <FormItem label="流水号">
                                                <p>
                                                    {{workIndex.stransactionnum}}
                                                </p>
                                            </FormItem>
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
                                            <FormItem label="录入员姓名">
                                                <p>
                                                    {{workIndex.supusercode + " : " + workIndex.supusername}}
                                                </p>
                                            </FormItem>
                                             <FormItem label="存款人名称">
                                                <Input v-model="workIndex.sdepositorname" type="textarea" :row="10" :placeholder="workIndex.sdepositorname"></Input>
                                            </FormItem>
                                            <FormItem v-show="latestReview !='' " label="最新审核意见">
                                                <p style="color: red">
                                                    {{latestReview}}
                                                </p>
                                            </FormItem>
                                            <FormItem>
                                                <Button @click="updateWorkIndexByDepositor">保存信息</Button>
                                                <Tooltip content="温馨提示：先保存信息再提交" placement="top">
                                                    <Button @click="updateWorkIndexByApprovalState" type="primary">提交任务</Button>
                                                </Tooltip>
                                            </FormItem>
                                        </Form>
                                    </div>
                                </Col>
                                <Col span="1">
                                    <div style="width: 100%">
                                    </div>
                                </Col>
                            </Row>
                        </div>
                </template>
            </div>
        </div>
        <!--<div class="layout-copy">-->
            <!--2018 &copy; 中国人民銀行湖南省-->
        <!--</div>-->
        <Modal
        v-model="previewModal"
        title="请检查图片内容和清晰度"
        :styles="{display: 'flex', alignItems:'center', justifyContent:'center', top:'10px'}">
            <div class="cropper-preiveiw-container">
                <div class="img-container">
                    <img id="image_preivew" class="cropper-hidden" :src="preview_img_url" />
                </div>
                <Form v-if="showAttachSelect" ref="uploadImageForm" :model="file_type" :rules="file_type_rules" :label-width="100">
                    <FormItem  label="附件类型" prop="file_type">
                        <Select v-model="file_type.file_type" style="width:200px" placeholder="请选择图片种类" >
                            <Option v-for="item in certi_kind_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button type="default" @click="cancelUpoad">
                    取消
                </Button>
                <Button type="primary" @click="confirmUpload">
                    保存
                </Button>
            </div>
        </Modal>
        <Modal
                id="checkModal"
                :title="check_preview_info"
                v-model="checkModal"
                :styles="{display: 'flex', alignItems:'center', justifyContent:'center', top:'10px'}">
            <div class="cropper-preiveiw-container">
                <div class="img-container">
                    <img id="image_check" class="cropper-hidden" :src="preview_img_url" />
                </div>
            </div>
        </Modal>
        <Modal
                v-model="newTaskModal"
                title="新建任务"
                :styles="{display: 'flex', alignItems:'center', justifyContent:'center'}">
            <div class="cropper-preiveiw-container">
                <Form ref="newTaskForm" :model="workIndex" :label-width="100" :rules="rules">
                    <FormItem label="业务类别" prop="sbusinesscategory">
                        <Select v-model="workIndex.sbusinesscategory" style="width:200px">
                            <Option v-for="item in businessList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="账户种类" prop="saccounttype">
                        <Select v-model="workIndex.saccounttype" style="width:200px">
                            <Option v-for="item in accountTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="存款人名称" prop="sdepositorname">
                        <Input v-model="workIndex.sdepositorname" type="textarea" :row="10" placeholder="请输入存款人名称..."></Input>
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
<script src="../../viewjs/bank_entry.js"></script>
