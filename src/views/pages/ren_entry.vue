<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        height: 100%;
    }
    .layout-assistant{
        width: 800px;
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
        margin-top: 2px;
        /*margin-bottom: 5px;*/
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
        <Menu mode="horizontal" style="width: 100%; " v-show="!ifEdit && !ifUpload" theme="light" active-name="accelerate" @on-select="changeTab">
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
                    待复审
                </MenuItem>
                <MenuItem name="final">
                    <Icon type="ios-flower"></Icon>
                    已复审
                </MenuItem>
                <MenuItem name="stoped">
                    <Icon type="stop"></Icon>
                    已终止
                </MenuItem>
            </div>
        </Menu>
        <div class="layout-breadcrumb">
            <Breadcrumb>
                <BreadcrumbItem to="/ren_entry">
                    <Icon type="ios-home-outline"></Icon> 主页
                </BreadcrumbItem>
                <BreadcrumbItem to="/ren_entry">
                    <Icon type="social-buffer-outline"></Icon> 影像审核
                </BreadcrumbItem>
                <BreadcrumbItem to="/ren_entry">
                    <Icon type="pound"></Icon> {{breadCrumb}}
                </BreadcrumbItem>
                <BreadcrumbItem to="/ren_entry" v-show="ifEdit">
                    <Button @click="showOperators" type="info" shape="circle" size="small">经办人</Button>
                </BreadcrumbItem>
                <BreadcrumbItem v-show="ifEdit || ifUpload">
                    <Button @click="returnBack" type="primary" shape="circle" size="small">返回</Button>
                </BreadcrumbItem>
            </Breadcrumb>
        </div>
        <div class="layout-content">
            <div class="layout-content-main">
                <template>
                    <div v-show="!ifEdit && !ifUpload" style="text-align: center" class="myDiv">
                        <Form :model="formSearch" label-position="right" :label-width="100" inline>
                            <FormItem label="银行机构代码">
                                <Input v-model="formSearch.fBankCode" size="small" style="width: 220px"></Input>
                            </FormItem>
                            <FormItem label="存款人名称">
                                <Input v-model="formSearch.fDepositorName" size="small" style="width: 220px"></Input>
                            </FormItem>
                            <FormItem label="业务类别">
                                <Select v-model="formSearch.fBusinessType" placeholder="业务类别" style="width:220px" size="small" transfer>
                                    <Option v-for="(item, index) in businessList" :value="item" :key="index">
                                        {{ item}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="操作">
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
                </template>
                <!-- 待审核 -->
                <template>
                    <div class="cropper-container" v-show="ifEdit && !ifUpload">
                        <Row type="flex" jutisfy="center" :gutter="6">
                            <!--<Col span="1">-->
                            <!--<div style="width: 100%">-->
                            <!--</div>-->
                            <!--</Col>-->
                            <Col span="8">
                                <div class="main-file">
                                    <div style="display: flex">
                                        <Tag >申请书查看区</Tag>
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
                                        <Tag>附件查看区</Tag>
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
                                    <ul v-if="check_img_files.length" class="img-list" :style="'height:'+img_list_height+'px'" >
                                        <li v-for="(img, index) in check_img_files" :key="index+img.date" style="display:flex">
                                            <my-check-image :imgfile="img" :index="index" @prepareImage="prepareImage" @initCropperImage="initCropperImage" @updateImgDestFiles="updateImgDestFiles" ></my-check-image>
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
                                        <FormItem label="有效期至" v-show="workIndex.suploadlicence === 0 && tabSelected !== 5 && workIndex.sbusinesscategory === '临时户展期'">
                                            <DatePicker @on-change="getExpireTime" type="date" placeholder="年月日"></DatePicker>
                                        </FormItem>
                                        <FormItem label="许可证核准号" prop="sapprovalcode" v-show="workIndex.suploadlicence === 0 && tabSelected !== 5 && workIndex.sifneedlicence === 1">
                                            <Input v-model="workIndex.sapprovalcode" placeholder="请输入许可证核准号"></Input>
                                        </FormItem>
                                        <FormItem label="许可证编号" prop="sidentifier" v-show="workIndex.suploadlicence === 0 && tabSelected !== 5 && workIndex.sifneedlicence === 1">
                                            <Input v-model="workIndex.sidentifier" placeholder="请输入许可证编号"></Input>
                                        </FormItem>
                                        <FormItem label="存款人密码" v-show="workIndex.suploadlicence === 0 && tabSelected !== 5 && workIndex.sifneedlicence === 0 && workIndex.sbusinesscategory === '存款人密码重置'">
                                            {{workIndex.sapprovalcode}}
                                        </FormItem>
                                        <FormItem label="存款人新密码" v-show="workIndex.suploadlicence === 0 && tabSelected !== 5 && workIndex.sifneedlicence === 0 && workIndex.sbusinesscategory === '存款人密码重置'">
                                            <Input v-model="workIndex.sidentifier" placeholder="请输入存款人新密码"></Input>
                                        </FormItem>
                                        <FormItem label="审批意见" v-show="workIndex.suploadlicence === 0 && tabSelected !== 5 && workIndex.srechecktime == null">
                                            <!--<Dropdown style="margin-left: 20px" placement="top" @on-click="onSelectOpinions" transfer>-->
                                            <!--<Button type="success" size="small">-->
                                            <!--备选意见-->
                                            <!--<Icon type="arrow-up-b"></Icon>-->
                                            <!--</Button>-->
                                            <!--<DropdownMenu v-for="(item,index) in groundsForReturnList" :key="index" slot="list">-->
                                            <!--<DropdownItem :name="index">{{item.sgrounds}}</DropdownItem>-->
                                            <!--</DropdownMenu>-->
                                            <!--</Dropdown>-->
                                            <Input v-model="recheck" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入审批意见"></Input>
                                        </FormItem>
                                        <FormItem v-show="workIndex.sapprovalstate === '待审核'">
                                            <Button @click="updateWorkIndexByApprovalStateBack" size="small">退回</Button>
                                            <Button @click="updateWorkIndexByApprovalStatePass" type="primary" size="small">通过</Button>
                                            <Button @click="updateWorkIndexByApprovalStateEnd" type="error" size="small">终止</Button>
                                        </FormItem>
                                        <FormItem label="有效期至" v-show="(workIndex.suploadlicence === 1 || workIndex.srechecktime !=null) && workIndex.sbusinesscategory === '临时户展期'">
                                            <DatePicker v-model="workIndex.sexpiretime" type="date" placeholder="年月日" :disabled="true"></DatePicker>
                                        </FormItem>
                                        <FormItem label="许可证核准号" v-show="(workIndex.suploadlicence === 1 || workIndex.srechecktime !=null) && workIndex.sifneedlicence ===1">
                                            <p>
                                                {{workIndex.sapprovalcode}}
                                            </p>
                                        </FormItem>
                                        <FormItem label="许可证编号" v-show="(workIndex.suploadlicence === 1 || workIndex.srechecktime !=null) && workIndex.sifneedlicence ===1">
                                            <p>
                                                {{workIndex.sidentifier}}
                                            </p>
                                        </FormItem>
                                        <FormItem label="存款人密码" v-show="(workIndex.suploadlicence === 1 || workIndex.srechecktime !=null) && workIndex.sifneedlicence ===0 && workIndex.sbusinesscategory === '存款人密码重置'">
                                            <p>
                                                {{workIndex.sapprovalcode}}
                                            </p>
                                        </FormItem>
                                        <FormItem label="存款人新密码" v-show="(workIndex.suploadlicence === 1 || workIndex.srechecktime !=null) && workIndex.sifneedlicence ===0 && workIndex.sbusinesscategory === '存款人密码重置'">
                                            <p>
                                                {{workIndex.sidentifier}}
                                            </p>
                                        </FormItem>
                                        <FormItem label="审批结果" v-show="workIndex.srechecktime !=null">
                                            <p>
                                                {{workIndex.srecheckresult}}
                                            </p>
                                        </FormItem>
                                        <FormItem label="审批意见" v-show="workIndex.srechecktime !=null || tabSelected === 5">
                                            <p>
                                                {{workIndex.srecheckopinion}}
                                            </p>
                                        </FormItem>
                                        <FormItem label="审批时间" v-show="workIndex.srechecktime !=null">
                                            <p>
                                                {{workIndex.srechecktime}}
                                            </p>
                                        </FormItem>
                                        <FormItem v-show="workIndex.suploadlicence === 1 && workIndex.sifneedlicence === 1">
                                            <Button @click="lookUpLicence" type="primary" size="small">查看许可证</Button>
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
                <!--待传证-->
                <template>
                    <div class="cropper-container" v-show="ifUpload && !ifEdit">
                        <Row type="flex" jutisfy="center" :gutter="6">
                            <Col span="1">
                                <div style="width: 100%"></div>
                            </Col>
                            <Col span="16">
                                <div class="main-file">
                                    <div style="display: flex">
                                        <Tag>许可证上传区</Tag>
                                        <div class="tool-bar">
                                            <Button type="primary" @click="zoom(0.1, 'certi')" class="index" size="small" :disabled="!certi_img_url || ifSaved">放大</Button>
                                            <Button type="primary" @click="zoom(-0.1, 'certi')" class="index" size="small" :disabled="!certi_img_url || ifSaved">缩小</Button>
                                            <Button type="primary" @click="rotate('certi')" class="index" size="small" :disabled="!certi_img_url || ifSaved">旋转</Button>
                                            <Button type="primary" v-show="!cropped_certi" @click="showCrop('certi')" class="index" size="small" :disabled="!certi_img_url || ifSaved">剪裁</Button>
                                            <Button type="primary" v-show="cropped_certi" @click="cropFinish('certi')" class="index" size="small" :disabled="ifSaved">完成剪裁</Button>
                                            <Button type="primary" v-show="cropped_certi" @click="cropCancel('certi')" class="index" size="small" :disabled="ifSaved">取消剪裁</Button>
                                            <input id="upload-input" accept="image/*" type="file" @change="handleFileChange" ref="inputer_certi" />
                                            <Button type="primary" icon="ios-cloud-upload-outline" @click="uploadFile" class="index" size="small" :disabled="ifSaved">选择许可证</Button>
                                            <Button type="success" @click="showPreviewModal('certi')" size="small" :disabled="!certi_img_url || ifSaved"> 保存</Button>
                                        </div>
                                    </div>
                                    <div class="myCropper-workspace" v-show="!certi_img_url">
                                        <div class="myCropper-words">许可证区</div>
                                    </div>
                                    <div class="img-container-certi" ref="certi">
                                        <img id="image_certi" v-show="img_hidden" :src="certi_img_url" />
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
                                            <Button @click="updateWorkIndexByLicence" type="primary">回传许可证</Button>
                                        </FormItem>
                                    </Form>
                                </div>
                            </Col>
                            <Col span="1">
                                <div style="width: 100%"></div>
                            </Col>
                        </Row>
                    </div>
                </template>
            </div>
        </div>
        <Modal
                v-model="previewModal"
                :styles="{display: 'flex', alignItems:'center', justifyContent:'center', top:'0px'}">
            <div class="cropper-preiveiw-container">
                <div class="img-container" :style="{height:previewModalHeight, width:previewModalWidth}">
                    <img id="image_preivew" class="cropper-hidden" />
                </div>
            </div>
            <div slot="footer">
                <Button type="default" @click="cancelUpoad">
                    取消
                </Button>
                <Button type="primary" @click="confirmUpload">
                    确定
                </Button>
            </div>
        </Modal>
        <Modal
                id="checkModal"
                v-model="checkModal"
                :styles="{display: 'flex', alignItems:'center', justifyContent:'center', top:'0px'}">
            <div class="cropper-preiveiw-container">
                <div class="img-container" :style="{height:previewModalHeight, width:previewModalWidth}">
                    <img id="image_check" class="cropper-hidden" :src="preview_img_url" />
                </div>
            </div>
        </Modal>
        <Modal
                id="returnModal"
                :title="returnType"
                v-model="returnModal"
                :styles="{display: 'flex', alignItems:'center', justifyContent:'center', top:'10px'}">
            <Form>
                <FormItem label="理由">
                    <Select v-model="groudsSelect" @on-change="onSelectOpinions" style="width: 300px" transfer>
                        <Option v-for="(item,index) in groundsForReturnList" :value="index" :key="index">
                            {{item.sgrounds}}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="审批意见">
                    <Input v-model="recheck" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入审批意见"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" @click="cancelReturnOrEnd">
                    取消
                </Button>
                <Button type="primary" @click="confirmReturnOrEnd">
                    确定
                </Button>
            </div>
        </Modal>
        <Modal
                id="modifyModal"
                title="许可证编号修改"
                v-model="modifyModal"
                :mask-closable="false"
                :closable="false"
                :styles="{display: 'flex', width:'550px', alignItems:'center', justifyContent:'center', top:'10px'}">
            <Form ref="modifyForm" :model="workIndex" :label-width="100" :rules="modifyRules">
                <FormItem label="流水号">
                    <p>
                        {{workIndex.stransactionnum}}
                    </p>
                </FormItem>
                <FormItem label="存款人名称">
                    <p>
                        {{workIndex.sdepositorname}}
                    </p>
                </FormItem>
                <FormItem label="业务种类">
                    <p>
                        {{workIndex.sbusinesscategory}}
                    </p>
                </FormItem>
                <FormItem label="账户类型">
                    <p>
                        {{workIndex.saccounttype}}
                    </p>
                </FormItem>
                <FormItem label="许可证核准号" prop="sapprovalcode">
                    <Input v-model="workIndex.sapprovalcode" placeholder="请输入许可证核准号"></Input>
                </FormItem>
                <FormItem label="许可证编号" prop="sidentifier">
                    <Input v-model="workIndex.sidentifier" placeholder="请输入许可证编号"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="default" @click="cancelModify">
                    取消
                </Button>
                <Button type="primary" @click="confirmModify">
                    确定
                </Button>
            </div>
        </Modal>
        <!--<Modal-->
        <!--id="passModal"-->
        <!--title="许可证确认"-->
        <!--v-model="passModal"-->
        <!--:styles="{display: 'flex', alignItems:'center', justifyContent:'center', top:'10px'}">-->
        <!--该业务是否需要开立/换发/补发许可证？-->
        <!--<div slot="footer">-->
        <!--<Button type="default" @click="cancelPass">-->
        <!--不需要-->
        <!--</Button>-->
        <!--<Button type="primary" @click="confirmPass">-->
        <!--需要-->
        <!--</Button>-->
        <!--</div>-->
        <!--</Modal>-->
    </div>
</template>
<script src="../../viewjs/ren_entry.js"></script>
