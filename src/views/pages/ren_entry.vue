<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        height: 100%;
    }
    .layout-assistant{
        width: 550px;
        margin: 0 auto;
        height: inherit;
        font-size: small;
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
    .img-container-certi{
        margin-bottom: 1rem;
        height: 0;/*594*420*/
        width: 100%;
        padding-bottom: 70.7%;
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
    .layout-breadcrumb{
        padding: 0px 15px 0;
    }
</style>
<template>
    <div class="layout">
        <Menu mode="horizontal" style="width: 100%; " theme="light" active-name="accelerate" @on-select="changeTab">
            <div class="layout-assistant">
                <MenuItem name="accelerate">
                    <Badge :count="accelerate_Num" >
                        <Icon type="android-plane"></Icon>
                        加急通道<span v-show="accelerate_Num!==0">&nbsp;&nbsp;&nbsp;</span>
                    </Badge>
                </MenuItem>
                <MenuItem name="recheck">
                    <Badge :count="recheck_Num" >
                        <Icon type="ios-circle-outline"></Icon>
                        待审核<span v-show="recheck_Num!==0">&nbsp;&nbsp;&nbsp;</span>
                    </Badge>
                </MenuItem>
                <MenuItem name="passed">
                    <Badge :count="passed_Num" >
                        <Icon type="ios-list"></Icon>
                        待传证<span v-show="passed_Num!==0">&nbsp;&nbsp;&nbsp;</span>
                    </Badge>
                </MenuItem>
                <MenuItem name="pass">
                    <Icon type="android-checkbox-outline-blank"></Icon>
                    已传证
                </MenuItem>
                <MenuItem name="final">
                    <Icon type="ios-flower"></Icon>
                    已复审
                </MenuItem>
            </div>
        </Menu>
        <div class="layout-breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem to="/">
                    <Icon type="ios-home-outline"></Icon> 主页
                </BreadcrumbItem>
                <BreadcrumbItem to="/ren_entry">
                    <Icon type="social-buffer-outline"></Icon> 影像审核
                </BreadcrumbItem>
                <BreadcrumbItem>
                    <Icon type="pound"></Icon> {{breadCrumb}}
                </BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div class="layout-content">
            <div class="layout-content-main">
                <template>
                    <div v-show="!ifEdit && !ifUpload">
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
                <!-- 待审核 -->
                <template>
                        <div class="cropper-container" v-show="ifEdit && !ifUpload">
                            <Row type="flex" jutisfy="center" :gutter="6">
                                <Col span="1">
                                    <div style="width: 100%">
                                    </div>
                                </Col>
                                <Col span="6">
                                    <div class="main-file">
                                        <div>
                                            <Tag color="blue" type="border">申请书查看区</Tag>
                                        </div>
                                        <div class="myCropper-workspace" v-show="!main_img_url">
                                            <div class="myCropper-words">请点击按钮选择申请书</div>
                                        </div>
                                        <div class="img-container">
                                            <img id="image_main" v-show="img_hidden" :src="main_img_url" />
                                        </div>
                                        <div class="tool-bar">
                                            <Button type="primary" @click="zoom(0.1, 'main')" class="index" size="small" :disabled="!main_img_url">放大</Button>
                                            <Button type="primary" @click="zoom(-0.1, 'main')" class="index" size="small" :disabled="!main_img_url">缩小</Button>
                                            <Button type="primary" @click="rotate('main')" class="index" size="small" :disabled="!main_img_url">旋转</Button>
                                        </div>
                                    </div>
                                </Col>
                                <Col span="6">
                                    <div class="attachment-files">
                                        <div>
                                            <Tag color="blue" type="border">附件查看区</Tag>
                                        </div>
                                        <div class="myCropper-workspace" v-show="!attachment_img_url">
                                            <div class="myCropper-words">请点击按钮批量选择附件</div>
                                        </div>
                                        <div class="img-container" ref="attachment">
                                            <img id="image_attachment" v-show="img_hidden" :src="attachment_img_url" />
                                        </div>
                                        <div class="tool-bar">
                                            <Button type="primary" @click="zoom(0.1, 'attachment')" class="index" size="small":disabled="!attachment_img_url">放大</Button>
                                            <Button type="primary" @click="zoom(-0.1, 'attachment')" class="index" size="small":disabled="!attachment_img_url">缩小</Button>
                                            <Button type="primary" @click="rotate('attachment')" class="index" size="small":disabled="!attachment_img_url">旋转</Button>
                                        </div>
                                    </div>
                                </Col>
                                <Col span="2">
                                    <div class="attachment-imgs">
                                        <div>
                                            <Tag color="green" type="border">附件列表</Tag>
                                        </div>
                                        <ul v-if="check_img_files.length" class="img-list" :style="'height:'+img_list_height+'px'" >
                                            <li v-for="(img, index) in check_img_files" :key="index+img.date">
                                                <my-check-image :imgfile="img" :index="index" @prepareImage="prepareImage" @initCropperImage="initCropperImage" ></my-check-image>
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
                                            <Tag color="blue" type="border">基本信息区</Tag>
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
                                             <FormItem label="存款人名称">
                                                 <p>
                                                     {{workIndex.sdepositorname}}
                                                 </p>
                                            </FormItem>
                                            <FormItem label="许可证核准号" v-show="tabSelected!=5 && tabSelected!=6">
                                                <Input v-model="workIndex.sapprovalcode" type="textarea" :row="10" placeholder="请输入许可证核准号"></Input>
                                            </FormItem>
                                            <FormItem label="许可证编号" v-show="tabSelected!=5 && tabSelected!=6">
                                                <Input v-model="workIndex.sidentifier" type="textarea" :row="10" placeholder="请输入许可证编号"></Input>
                                            </FormItem>
                                            <FormItem label="审批意见" v-show="tabSelected!=5 && tabSelected!=6">
                                                <Dropdown style="margin-left: 20px" placement="top" @on-click="onSelectOpinions" transfer>
                                                    <Button type="success" size="small">
                                                        备选意见
                                                        <Icon type="arrow-up-b"></Icon>
                                                    </Button>
                                                    <DropdownMenu v-for="(item,index) in reviewOpinion" :key="index" slot="list">
                                                        <DropdownItem :name="index">{{item}}</DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>
                                                <Input v-model="recheck" type="textarea" :row="10" placeholder="请输入审批意见"></Input>
                                            </FormItem>
                                            <FormItem v-show="tabSelected!=5 && tabSelected!=6">
                                                <Button @click="updateWorkIndexByApprovalStateBack">退回重做</Button>
                                                <Button @click="updateWorkIndexByApprovalStatePass" type="primary">审核通过</Button>
                                            </FormItem>
                                            <FormItem label="许可证核准号" v-show="tabSelected==5 || tabSelected==6">
                                                <p>
                                                    {{workIndex.sapprovalcode}}
                                                </p>
                                            </FormItem>
                                            <FormItem label="许可证编号" v-show="tabSelected==5 || tabSelected==6">
                                                <p>
                                                    {{workIndex.sidentifier}}
                                                </p>
                                            </FormItem>
                                            <FormItem label="审批结果" v-show="tabSelected === 6">
                                                <p>
                                                    {{workIndex.srecheckresult}}
                                                </p>
                                            </FormItem>
                                            <FormItem label="审批意见" v-show="tabSelected === 6">
                                                <p>
                                                    {{workIndex.srecheckopinion}}
                                                </p>
                                            </FormItem>
                                            <FormItem label="审批时间" v-show="tabSelected === 6">
                                                <p>
                                                    {{workIndex.srechecktime}}
                                                </p>
                                            </FormItem>
                                            <FormItem v-show="tabSelected==5 || tabSelected==6">
                                                <Button @click="lookUpLicence" type="primary" size="small">查看许可证</Button>
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
                <!--待传证-->
                <template>
                    <div class="cropper-container" v-show="ifUpload && !ifEdit">
                        <Row type="flex" jutisfy="center" :gutter="6">
                            <Col span="3">
                                <div style="width: 100%"></div>
                            </Col>
                            <Col span="12">
                                <div class="main-file">
                                    <div>
                                        <Tag color="blue" type="border">许可证上传区</Tag>
                                    </div>
                                    <div class="myCropper-workspace" v-show="!certi_img_url">
                                        <div class="myCropper-words">请点击按钮选择许可证</div>
                                    </div>
                                    <div class="img-container-certi" ref="certi">
                                        <img id="image_certi" v-show="img_hidden" :src="certi_img_url" />
                                    </div>
                                    <div class="tool-bar">
                                        <Button type="primary" @click="zoom(0.1, 'certi')" class="index" size="small" :disabled="!certi_img_url || ifSaved">放大</Button>
                                        <Button type="primary" @click="zoom(-0.1, 'certi')" class="index" size="small" :disabled="!certi_img_url || ifSaved">缩小</Button>
                                        <Button type="primary" @click="rotate('certi')" class="index" size="small" :disabled="!certi_img_url || ifSaved">旋转</Button>
                                        <Button type="primary" v-show="!cropped_certi" @click="showCrop('certi')" class="index" size="small" :disabled="!certi_img_url || ifSaved">剪裁</Button>
                                        <Button type="primary" v-show="cropped_certi" @click="cropFinish('certi')" class="index" size="small" :disabled="ifSaved">完成剪裁</Button>
                                        <Button type="primary" v-show="cropped_certi" @click="cropCancel('certi')" class="index" size="small" :disabled="ifSaved">取消剪裁</Button>
                                        <input id="upload-input" accept="image/*" type="file" @change="handleFileChange" ref="inputer_certi" />
                                        <Button type="ghost" icon="ios-cloud-upload-outline" @click="uploadFile" class="index" size="small" :disabled="ifSaved">选择许可证</Button>
                                        <Button type="success" @click="showPreviewModal('certi')" size="small" :disabled="!certi_img_url || ifSaved"> 保存</Button>
                                    </div>
                                </div>
                            </Col>
                            <Col span="2">
                                <div class="attachment-imgs">
                                    <div>
                                        <Tag color="green" type="border">已保存</Tag>
                                    </div>
                                    <ul v-if="dest_img_files.length" class="img-list" :style="'height:'+img_list_height+'px'" >
                                        <li v-for="(img, index) in dest_img_files" :key="index+img.date">
                                            <my-dest-image :imgfile="img" :index="index" @showCheckModal="showCheckModal" @deleteImgFromDB="deleteImgFromDB" ></my-dest-image>
                                            <Tooltip :content="img.type" placement="bottom-end">
                                                <Tag style="width: 50px; size: 2px" color = green>
                                                    {{img.number}}
                                                </Tag>
                                            </Tooltip>
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                            <Col span="4">
                                <div class="informations">
                                    <div>
                                        <Tag color="blue" type="border">基本信息区</Tag>
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
                                        <!--<FormItem label="开户行机构代码">-->
                                            <!--<p>-->
                                                <!--{{workIndex.sbankcode}}-->
                                            <!--</p>-->
                                        <!--</FormItem>-->
                                        <FormItem label="开户行机构名称">
                                            <p>
                                                {{workIndex.sbankname}}
                                            </p>
                                        </FormItem>
                                        <!--<FormItem label="录入员姓名">-->
                                            <!--<p>-->
                                                <!--{{workIndex.supusercode + " : " + workIndex.supusername}}-->
                                            <!--</p>-->
                                        <!--</FormItem>-->
                                        <FormItem label="存款人名称">
                                            <p>
                                                {{workIndex.sdepositorname}}
                                            </p>
                                        </FormItem>
                                        <FormItem label="许可证核准号">
                                            <p>
                                                {{workIndex.sapprovalcode}}
                                            </p>
                                        </FormItem>
                                        <FormItem label="许可证编号">
                                            <p>
                                                {{workIndex.sidentifier}}
                                            </p>
                                        </FormItem>
                                        <FormItem>
                                            <Button @click="updateWorkIndexByLicence" type="primary">上传许可证</Button>
                                        </FormItem>
                                    </Form>
                                </div>
                            </Col>
                            <Col span="3">
                                <div style="width: 100%"></div>
                            </Col>
                        </Row>
                    </div>
                </template>
            </div>
        </div>
        <Modal
                v-model="previewModal"
                title="请检查图片内容和清晰度"
                :styles="{display: 'flex', alignItems:'center', justifyContent:'center', top:'10px'}">
            <div class="cropper-preiveiw-container">
                <div class="img-container">
                    <img id="image_preivew" class="cropper-hidden" />
                </div>
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
    </div>
</template>
<script src="../../viewjs/ren_entry.js"></script>
